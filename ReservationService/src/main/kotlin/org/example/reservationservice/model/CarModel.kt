package org.example.reservationservice.model

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(
    name = "car_model",
    uniqueConstraints = [UniqueConstraint(columnNames = ["brand", "model", "model_year"])]
)
data class CarModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val brand: String,
    val model: String,

    @Column(name = "model_year")
    val modelYear: Int,

    val segment: String,
    val doors: Int,

    @Column(name = "seating_capacity")
    val seatingCapacity: Int,

    @Column(name = "luggage_capacity")
    val luggageCapacity: Int,

    val category: String,

    @Column(name = "engine_type")
    val engineType: String,

    @Column(name = "transmission_type")
    val transmissionType: String,

    val drivetrain: String,

    @Column(name = "motor_displacement", precision = 5, scale = 2)
    val motorDisplacement: BigDecimal? = null,

    @Column(name = "air_conditioning")
    val airConditioning: Boolean,

    @Column(name = "infotainment_options", columnDefinition = "TEXT")
    val infotainmentOptions: String? = null,

    @Column(name = "safety_features", columnDefinition = "TEXT")
    val safetyFeatures: String? = null,

    @Column(name = "rental_price_per_day", precision = 10, scale = 2)
    val rentalPricePerDay: BigDecimal
)
