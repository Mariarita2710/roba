package org.example.reservationservice.service

import org.example.reservationservice.dto.VehiclePatchDTO
import org.example.reservationservice.dto.VehicleRequestDTO
import org.example.reservationservice.dto.VehicleResponseDTO
import org.example.reservationservice.model.Vehicle
import org.example.reservationservice.model.VehicleStatus
import org.example.reservationservice.repository.CarModelRepository
import org.example.reservationservice.repository.VehicleRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.fge.jsonpatch.JsonPatch
import com.github.fge.jsonpatch.JsonPatchException
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.PropertyNamingStrategies
import org.example.reservationservice.exception.*


@Service
class VehicleService(
    private val vehicleRepository: VehicleRepository,
    private val carModelRepository: CarModelRepository
) {
    private val logger = LoggerFactory.getLogger(VehicleService::class.java)

    private val allowedPaths = setOf(
        "/kilometersTravelled",
        "/pendingCleaning",
        "/pendingRepairs",
        "/status"
    )

    private fun validatePatchPaths(patchNode: JsonNode) {
        patchNode.forEach { operation ->
            val path = operation.get("path")?.asText()
            println("Validating path: $path")
            if (path == null || path !in allowedPaths) {
                throw UnauthorizedPatchPathException(path ?: "<unknown>")
            }
        }
    }

    fun findAll(): List<VehicleResponseDTO> =
        vehicleRepository.findAll().map { VehicleResponseDTO.from(it) }

    fun findById(id: Long): VehicleResponseDTO =
        vehicleRepository.findById(id).orElseThrow { VehicleNotFound(id) }
            .let { VehicleResponseDTO.from(it) }

    fun findAllFiltered(status: String?, carModelId: Long?, pageable: Pageable): Page<VehicleResponseDTO> {
        val page = vehicleRepository.findAllFiltered(status, carModelId, pageable)
        return page.map { VehicleResponseDTO.from(it) }
    }

    fun create(request: VehicleRequestDTO): VehicleResponseDTO {
        if (vehicleRepository.existsByLicensePlate(request.licensePlate)) {
            throw DuplicateVehicleException("Vehicle with license plate '${request.licensePlate}' already exists.")
        }
        val carModel = carModelRepository.findById(request.carModelId)
            .orElseThrow { CarModelNotFoundException("Car model with ID ${request.carModelId} not found") }

        val statusEnum = VehicleStatus.valueOf(request.status.uppercase())

        val vehicle = Vehicle(
            licensePlate = request.licensePlate,
            vin = request.vin,
            status = statusEnum,
            kilometersTravelled = request.kilometersTravelled,
            pendingCleaning = request.pendingCleaning,
            pendingRepairs = request.pendingRepairs,
            carModel = carModel
        )

        val saved = vehicleRepository.save(vehicle)

        logger.info("Created vehicle with ID ${saved.id}, license plate '${saved.licensePlate}'")

        return VehicleResponseDTO.from(saved)
    }

    fun update(id: Long, request: VehicleRequestDTO): VehicleResponseDTO {
        val existing = vehicleRepository.findById(id)
            .orElseThrow { VehicleNotFound(id) }

        val carModel = carModelRepository.findById(request.carModelId)
            .orElseThrow { IllegalArgumentException("CarModel with ID ${request.carModelId} not found") }

        val statusEnum = VehicleStatus.valueOf(request.status.uppercase())

        val updated = existing.copy(
            licensePlate = request.licensePlate,
            vin = request.vin,
            status = statusEnum,
            kilometersTravelled = request.kilometersTravelled,
            pendingCleaning = request.pendingCleaning,
            pendingRepairs = request.pendingRepairs,
            carModel = carModel
        )

        val saved = vehicleRepository.save(updated)

        logger.info("Updated vehicle with ID ${saved.id}")

        return VehicleResponseDTO.from(saved)
    }

    fun delete(id: Long) {
        if (!vehicleRepository.existsById(id)) {
            throw VehicleNotFound(id)
        }
        vehicleRepository.deleteById(id)
        logger.info("Deleted vehicle with ID $id")
    }

    fun patch(id: Long, patch: VehiclePatchDTO): VehicleResponseDTO {
        var existing = vehicleRepository.findById(id)
            .orElseThrow { VehicleNotFound(id) }
        var changed = false

        patch.status?.let {
            if (existing.status.name != it) {
                logger.info("Updating status of vehicle $id from ${existing.status} to $it")
                existing.status = VehicleStatus.valueOf(it)
                changed = true
            }
        }

        patch.kilometersTravelled?.let {
            if (existing.kilometersTravelled != it) {
                logger.info("Updating kilometers_travelled of vehicle $id from ${existing.kilometersTravelled} to $it")
                existing.kilometersTravelled = it
                changed = true
            }
        }

        patch.pendingCleaning?.let {
            if (existing.pendingCleaning != it) {
                logger.info("Updating pending_cleaning of vehicle $id from ${existing.pendingCleaning} to $it")
                existing.pendingCleaning = it
                changed = true
            }
        }

        patch.pendingRepairs?.let {
            if (existing.pendingRepairs != it) {
                logger.info("Updating pending_repairs of vehicle $id from ${existing.pendingRepairs} to $it")
                existing.pendingRepairs = it
                changed = true
            }
        }

        if (changed) {
            vehicleRepository.save(existing)
        } else {
            logger.info("No changes detected for vehicle $id")
        }

        return VehicleResponseDTO.from(existing)
    }


    fun applyPatchToVehicle(id: Long, patch: JsonPatch): VehicleResponseDTO {
        val existingVehicle = vehicleRepository.findById(id)
            .orElseThrow { VehicleNotFound(id) }

        val objectMapper = ObjectMapper()
        val emptyDtoNode = objectMapper.convertValue(VehiclePatchDTO(), JsonNode::class.java)

        try {
            validatePatchPaths(objectMapper.valueToTree(patch))

            val patchedNode = patch.apply(emptyDtoNode)
            val patchedDTO = objectMapper.treeToValue(patchedNode, VehiclePatchDTO::class.java)

            var changed = false

            patchedDTO.status?.let {
                val newStatus = try {
                    VehicleStatus.valueOf(it.uppercase())
                } catch (e: IllegalArgumentException) {
                    throw InvalidPatchException("Invalid status value: '$it'", e)
                }
                if (existingVehicle.status != newStatus) {
                    logger.info("Updating status of vehicle $id from ${existingVehicle.status} to $newStatus")
                    existingVehicle.status = newStatus
                    changed = true
                }
            }

            patchedDTO.kilometersTravelled?.let {
                if (existingVehicle.kilometersTravelled != it) {
                    logger.info("Updating kilometersTravelled of vehicle $id from ${existingVehicle.kilometersTravelled} to $it")
                    existingVehicle.kilometersTravelled = it
                    changed = true
                }
            }

            patchedDTO.pendingCleaning?.let {
                if (existingVehicle.pendingCleaning != it) {
                    logger.info("Updating pendingCleaning of vehicle $id from ${existingVehicle.pendingCleaning} to $it")
                    existingVehicle.pendingCleaning = it
                    changed = true
                }
            }

            patchedDTO.pendingRepairs?.let {
                if (existingVehicle.pendingRepairs != it) {
                    logger.info("Updating pendingRepairs of vehicle $id from ${existingVehicle.pendingRepairs} to $it")
                    existingVehicle.pendingRepairs = it
                    changed = true
                }
            }

            if (changed) {
                vehicleRepository.save(existingVehicle)
                logger.info("Vehicle $id updated successfully")
            } else {
                logger.info("No changes detected for vehicle $id")
            }

            return VehicleResponseDTO.from(existingVehicle)

        } catch (ex: JsonPatchException) {
            throw InvalidPatchException("Error applying JSON Patch: ${ex.message}", ex)
        } catch (ex: JsonProcessingException) {
            throw InvalidPatchException("JSON processing error: ${ex.message}", ex)
        }
    }



}
