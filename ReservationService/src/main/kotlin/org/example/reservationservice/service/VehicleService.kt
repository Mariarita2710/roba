package org.example.reservationservice.service

import org.example.reservationservice.dto.VehicleRequestDTO
import org.example.reservationservice.dto.VehicleResponseDTO
import org.example.reservationservice.exception.VehicleNotFound
import org.example.reservationservice.exception.DuplicateVehicleException
import org.example.reservationservice.exception.CarModelNotFoundException
import org.example.reservationservice.model.Vehicle
import org.example.reservationservice.model.VehicleStatus
import org.example.reservationservice.repository.CarModelRepository
import org.example.reservationservice.repository.VehicleRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable


@Service
class VehicleService(
    private val vehicleRepository: VehicleRepository,
    private val carModelRepository: CarModelRepository
) {
    private val logger = LoggerFactory.getLogger(VehicleService::class.java)


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
}
