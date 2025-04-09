package org.example.reservationservice.service

import org.example.reservationservice.dto.CarModelRequestDTO
import org.example.reservationservice.dto.CarModelResponseDTO
import org.example.reservationservice.exception.CarModelNotFoundException
import org.example.reservationservice.exception.DuplicateCarModel
import org.example.reservationservice.model.CarModel
import org.example.reservationservice.repository.CarModelRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class CarModelService(
    private val repository: CarModelRepository
) {
    private val logger = LoggerFactory.getLogger(CarModelService::class.java)

    fun findAllFiltered(
        brand: String?,
        segment: String?,
        engineType: String?,
        transmissionType: String?,
        modelYear: Int?,
        pageable: Pageable
    ): Page<CarModelResponseDTO> {
        return repository.findFiltered(
            brand,
            segment,
            engineType,
            transmissionType,
            modelYear,
            pageable
        ).map { it.toResponseDTO() }
    }

    fun findById(id: Long): CarModelResponseDTO =
        repository.findById(id)
            .orElseThrow { CarModelNotFoundException("Car model with id $id not found") }
            .toResponseDTO()

    fun create(request: CarModelRequestDTO): CarModelResponseDTO {
        if (repository.existsByBrandAndModel(request.brand, request.model)) {
            throw DuplicateCarModel("Car model '${request.brand} ${request.model} ${request.modelYear}' already exists")
        }
        val saved = repository.save(request.toEntity())
        logger.info("Created car model: ${saved.id}")
        return saved.toResponseDTO()
    }

    fun update(id: Long, request: CarModelRequestDTO): CarModelResponseDTO {
        val existing = repository.findById(id)
            .orElseThrow { CarModelNotFoundException("Car model with id $id not found") }

        val updated = repository.save(
            existing.copy(
                brand = request.brand,
                model = request.model,
                modelYear = request.modelYear,
                segment = request.segment,
                doors = request.doors,
                seatingCapacity = request.seatingCapacity,
                luggageCapacity = request.luggageCapacity,
                category = request.category,
                engineType = request.engineType,
                transmissionType = request.transmissionType,
                drivetrain = request.drivetrain,
                motorDisplacement = request.motorDisplacement,
                airConditioning = request.airConditioning,
                infotainmentOptions = request.infotainmentOptions,
                safetyFeatures = request.safetyFeatures,
                rentalPricePerDay = request.rentalPricePerDay
            )
        )
        logger.info("Updated car model: $id")
        return updated.toResponseDTO()
    }

    fun delete(id: Long) {
        if (!repository.existsById(id)) {
            throw CarModelNotFoundException("Car model with id $id not found")
        }
        repository.deleteById(id)
        logger.info("Deleted car model: $id")
    }

    private fun CarModel.toResponseDTO() = CarModelResponseDTO(
        id = id,
        brand = brand,
        model = model,
        modelYear = modelYear,
        segment = segment,
        doors = doors,
        seatingCapacity = seatingCapacity,
        luggageCapacity = luggageCapacity,
        category = category,
        engineType = engineType,
        transmissionType = transmissionType,
        drivetrain = drivetrain,
        motorDisplacement = motorDisplacement,
        airConditioning = airConditioning,
        infotainmentOptions = infotainmentOptions,
        safetyFeatures = safetyFeatures,
        rentalPricePerDay = rentalPricePerDay
    )

    private fun CarModelRequestDTO.toEntity() = CarModel(
        brand = brand,
        model = model,
        modelYear = modelYear,
        segment = segment,
        doors = doors,
        seatingCapacity = seatingCapacity,
        luggageCapacity = luggageCapacity,
        category = category,
        engineType = engineType,
        transmissionType = transmissionType,
        drivetrain = drivetrain,
        motorDisplacement = motorDisplacement,
        airConditioning = airConditioning,
        infotainmentOptions = infotainmentOptions,
        safetyFeatures = safetyFeatures,
        rentalPricePerDay = rentalPricePerDay
    )
}
