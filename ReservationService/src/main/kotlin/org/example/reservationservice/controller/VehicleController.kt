package org.example.reservationservice.controller

import org.example.reservationservice.dto.VehicleRequestDTO
import org.example.reservationservice.dto.VehicleResponseDTO
import org.example.reservationservice.service.VehicleService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/vehicles")
class VehicleController(
    private val service: VehicleService
) {

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
    fun create(@RequestBody request: VehicleRequestDTO): VehicleResponseDTO =
        service.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: VehicleRequestDTO): VehicleResponseDTO =
        service.update(id, request)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }
}
