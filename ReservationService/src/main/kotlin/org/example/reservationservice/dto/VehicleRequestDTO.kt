package org.example.reservationservice.dto

data class VehicleRequestDTO(
    val carModelId: Long,
    val licensePlate: String,
    val vin: String,
    val status: String,
    val kilometersTravelled: Int = 0,
    val pendingCleaning: Boolean = false,
    val pendingRepairs: Boolean = false
)
