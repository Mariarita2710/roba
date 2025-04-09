package org.example.reservationservice.model

import jakarta.persistence.*

@Entity
@Table(name = "vehicle")
data class Vehicle(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_model_id", nullable = false)
    val carModel: CarModel,

    @Column(name = "license_plate", unique = true, nullable = false)
    val licensePlate: String,

    @Column(name = "vin", unique = true, nullable = false)
    val vin: String,

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    val status: VehicleStatus,

    @Column(name = "kilometers_travelled", nullable = false)
    val kilometersTravelled: Int = 0,

    @Column(name = "pending_cleaning")
    val pendingCleaning: Boolean = false,

    @Column(name = "pending_repairs")
    val pendingRepairs: Boolean = false
)

enum class VehicleStatus {
    AVAILABLE, RENTED, UNDER_MAINTENANCE
}
