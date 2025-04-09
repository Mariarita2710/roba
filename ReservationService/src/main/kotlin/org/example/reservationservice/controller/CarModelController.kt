package org.example.reservationservice.controller

import org.example.reservationservice.dto.CarModelRequestDTO
import org.example.reservationservice.dto.CarModelResponseDTO
import org.example.reservationservice.service.CarModelService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/api/v1/models")
class CarModelController(
    private val carModelService: CarModelService
) {

    @GetMapping
    fun getAll(
        @RequestParam(required = false) brand: String?,
        @RequestParam(required = false) model: String?,
        @RequestParam(required = false) segment: String?,
        @RequestParam(required = false) engineType: String?,
        @RequestParam(required = false) transmissionType: String?,
        @RequestParam(required = false) modelYear: Int?,
        @RequestParam(required = false) minPrice: Double?,
        @RequestParam(required = false) maxPrice: Double?,
        pageable: Pageable
    ): Page<CarModelResponseDTO> {
        return carModelService.findAllFiltered(
            brand,
            model,
            segment,
            engineType,
            transmissionType,
            modelYear,
            minPrice,
            maxPrice,
            pageable
        )
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): CarModelResponseDTO =
        carModelService.findById(id)

    @PostMapping
    fun create(@RequestBody request: CarModelRequestDTO): ResponseEntity<CarModelResponseDTO> {
        val created = carModelService.create(request)
        val location = URI.create("/api/v1/models/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: CarModelRequestDTO): CarModelResponseDTO =
        carModelService.update(id, request)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) =
        carModelService.delete(id)
}
