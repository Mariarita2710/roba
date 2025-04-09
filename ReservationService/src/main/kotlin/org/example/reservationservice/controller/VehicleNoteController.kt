package org.example.reservationservice.controller

import org.example.reservationservice.dto.VehicleNoteRequestDTO
import org.example.reservationservice.dto.VehicleNoteResponseDTO
import org.example.reservationservice.service.VehicleNoteService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/v1/vehicles/{vehicleId}/notes")
class VehicleNoteController(
    private val service: VehicleNoteService
) {

    @GetMapping
    fun findAllByVehicleId(
        @PathVariable vehicleId: Long,
        @RequestParam(required = false) author: String?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) from: LocalDateTime?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) to: LocalDateTime?,
        pageable: Pageable
    ): Page<VehicleNoteResponseDTO> =
        service.findByVehicleIdWithFilters(vehicleId, author, from, to, pageable)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable vehicleId: Long,
        @RequestBody request: VehicleNoteRequestDTO
    ): VehicleNoteResponseDTO = service.create(vehicleId, request)

    @PutMapping("/{noteId}")
    fun update(
        @PathVariable noteId: Long,
        @RequestBody request: VehicleNoteRequestDTO
    ): VehicleNoteResponseDTO = service.update(noteId, request)

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable noteId: Long) {
        service.delete(noteId)
    }
}
