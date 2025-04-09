package org.example.reservationservice.dto

import java.math.BigDecimal

data class CarModelRequestDTO(
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
    val motorDisplacement: BigDecimal? = null,
    val airConditioning: Boolean,
    val infotainmentOptions: String? = null,
    val safetyFeatures: String? = null,
    val rentalPricePerDay: BigDecimal,
    val safetyRating: Int
)
