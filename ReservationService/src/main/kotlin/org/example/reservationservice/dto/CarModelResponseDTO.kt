package org.example.reservationservice.dto

import java.math.BigDecimal
import org.example.reservationservice.model.CarModel

data class CarModelResponseDTO(
    val id: Long,
    val brand: String,
    val model: String,
    val modelYear: Int,
    val segment: String,
    val doors: Int,
    val seatingCapacity: Int,
    val luggageCapacity: Int,
    val category: String,
    val engineType: String,
    val transmissionType: String,
    val drivetrain: String,
    val motorDisplacement: BigDecimal?,
    val airConditioning: Boolean,
    val infotainmentOptions: String?,
    val safetyFeatures: String?,
    val rentalPricePerDay: BigDecimal,
    val safetyRating: Int
) {
    companion object {
        fun from(carModel: CarModel): CarModelResponseDTO {
            return CarModelResponseDTO(
                id = carModel.id,
                brand = carModel.brand,
                model = carModel.model,
                modelYear = carModel.modelYear,
                segment = carModel.segment,
                doors = carModel.doors,
                seatingCapacity = carModel.seatingCapacity,
                luggageCapacity = carModel.luggageCapacity,
                category = carModel.category,
                engineType = carModel.engineType,
                transmissionType = carModel.transmissionType,
                drivetrain = carModel.drivetrain,
                motorDisplacement = carModel.motorDisplacement,
                airConditioning = carModel.airConditioning,
                infotainmentOptions = carModel.infotainmentOptions,
                safetyFeatures = carModel.safetyFeatures,
                rentalPricePerDay = carModel.rentalPricePerDay,
                safetyRating = carModel.safetyRating
            )
        }
    }
}
