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
    var status: VehicleStatus,

    @Column(name = "kilometers_travelled", nullable = false)
    var kilometersTravelled: Int = 0,

    @Column(name = "pending_cleaning")
    var pendingCleaning: Boolean = false,

    @Column(name = "pending_repairs")
    var pendingRepairs: Boolean = false
)

enum class VehicleStatus {
    AVAILABLE, RENTED, UNDER_MAINTENANCE
}
