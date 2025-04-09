package org.example.reservationservice.controller

import org.example.reservationservice.dto.MaintenanceRecordRequestDTO
import org.example.reservationservice.dto.MaintenanceRecordResponseDTO
import org.example.reservationservice.service.MaintenanceRecordService
import org.springframework.data.domain.Page
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.net.URI
import org.springframework.data.domain.Pageable

@RestController
@RequestMapping("/api/v1/vehicles/{vehicleId}/maintenances")
class MaintenanceRecordController(
    private val service: MaintenanceRecordService
) {

    @GetMapping
    fun getAll(
        @PathVariable vehicleId: Long,
        @RequestParam(required = false) type: String?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) from: LocalDateTime?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) to: LocalDateTime?,
        pageable: Pageable
    ): Page<MaintenanceRecordResponseDTO> =
        service.findByVehicleIdWithFilters(vehicleId, type, from, to, pageable)

    @GetMapping("/{maintenanceId}")
    fun getById(@PathVariable maintenanceId: Long): MaintenanceRecordResponseDTO =
        service.findById(maintenanceId)

    @PostMapping
    fun create(
        @PathVariable vehicleId: Long,
        @RequestBody request: MaintenanceRecordRequestDTO
    ): ResponseEntity<MaintenanceRecordResponseDTO> {
        val created = service.create(vehicleId, request)
        val location = URI.create("/api/v1/vehicles/$vehicleId/maintenances/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @PutMapping("/{maintenanceId}")
    fun update(
        @PathVariable maintenanceId: Long,
        @RequestBody request: MaintenanceRecordRequestDTO
    ): MaintenanceRecordResponseDTO = service.update(maintenanceId, request)

    @DeleteMapping("/{maintenanceId}")
    fun delete(@PathVariable maintenanceId: Long) {
        service.delete(maintenanceId)
    }
}
