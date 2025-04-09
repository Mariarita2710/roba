package org.example.reservationservice.controller

import org.example.reservationservice.dto.VehiclePatchDTO
import org.example.reservationservice.dto.VehicleRequestDTO
import org.example.reservationservice.dto.VehicleResponseDTO
import org.example.reservationservice.service.VehicleService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.web.bind.annotation.*
import java.net.URI
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import com.github.fge.jsonpatch.JsonPatch
import org.example.reservationservice.exception.UnauthorizedPatchPathException
import org.example.reservationservice.model.Vehicle
import org.slf4j.LoggerFactory


@RestController
@RequestMapping("/api/v1/vehicles")
class VehicleController(
    private val service: VehicleService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun getAll(
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) carModelId: Long?,
        @PageableDefault(size = 10) pageable: Pageable
    ): Page<VehicleResponseDTO> =
        service.findAllFiltered(status, carModelId, pageable)

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): VehicleResponseDTO =
        service.findById(id)

    @PostMapping
    fun create(@RequestBody request: VehicleRequestDTO): ResponseEntity<VehicleResponseDTO> {
        val created = service.create(request)
        val location = URI.create("/api/v1/vehicles/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: VehicleRequestDTO): VehicleResponseDTO =
        service.update(id, request)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }

    @PatchMapping("/{id}", consumes = ["application/json-patch+json"])
    fun patchVehicle(
        @PathVariable id: Long,
        @RequestBody patch: JsonPatch
    ): ResponseEntity<VehicleResponseDTO> {
        return try {
            val updatedVehicle = service.applyPatchToVehicle(id, patch)
            ResponseEntity.ok(updatedVehicle)
        } catch (e: UnauthorizedPatchPathException) {
            logger.warn("Unauthorized PATCH path: ${e.message}")

            ResponseEntity.status(HttpStatus.FORBIDDEN).body(null)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        } catch (e: RuntimeException) {
            // Includendo errori di JsonPatchException e JsonProcessingException
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

}
