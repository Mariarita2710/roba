package org.example.reservationservice.controller

import org.example.reservationservice.dto.CarModelRequestDTO
import org.example.reservationservice.dto.CarModelResponseDTO
import org.example.reservationservice.service.CarModelService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/models")
class CarModelController(
    private val carModelService: CarModelService
) {

    @GetMapping
    fun getAll(
        @RequestParam(required = false) brand: String?,
        @RequestParam(required = false) segment: String?,
        @RequestParam(required = false) engineType: String?,
        @RequestParam(required = false) transmissionType: String?,
        @RequestParam(required = false) modelYear: Int?,
        pageable: Pageable
    ): Page<CarModelResponseDTO> {
        return carModelService.findAllFiltered(brand, segment, engineType, transmissionType, modelYear, pageable)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): CarModelResponseDTO =
        carModelService.findById(id)

    @PostMapping
    fun create(@RequestBody request: CarModelRequestDTO): CarModelResponseDTO =
        carModelService.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: CarModelRequestDTO): CarModelResponseDTO =
        carModelService.update(id, request)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) =
        carModelService.delete(id)
}
