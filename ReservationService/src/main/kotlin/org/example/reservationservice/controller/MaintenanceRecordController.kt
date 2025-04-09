package org.example.reservationservice.controller

import org.example.reservationservice.dto.MaintenanceRecordRequestDTO
import org.example.reservationservice.dto.MaintenanceRecordResponseDTO
import org.example.reservationservice.service.MaintenanceRecordService
import org.springframework.data.domain.Page
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
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
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable vehicleId: Long,
        @RequestBody request: MaintenanceRecordRequestDTO
    ): MaintenanceRecordResponseDTO =
        service.create(vehicleId, request)

    @PutMapping("/{maintenanceId}")
    fun update(
        @PathVariable maintenanceId: Long,
        @RequestBody request: MaintenanceRecordRequestDTO
    ): MaintenanceRecordResponseDTO =
        service.update(maintenanceId, request)

    @DeleteMapping("/{maintenanceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable maintenanceId: Long) {
        service.delete(maintenanceId)
    }
}
