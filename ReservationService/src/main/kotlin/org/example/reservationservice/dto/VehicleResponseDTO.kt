package org.example.reservationservice.dto

import org.example.reservationservice.model.Vehicle


data class VehicleResponseDTO(
    val id: Long,
    val carModel: CarModelResponseDTO,
    val licensePlate: String,
    val vin: String,
    val status: String,
    val kilometersTravelled: Int,
    val pendingCleaning: Boolean,
    val pendingRepairs: Boolean
){
    companion object {
        fun from(vehicle: Vehicle) = VehicleResponseDTO(
            id = vehicle.id,
            licensePlate = vehicle.licensePlate,
            vin = vehicle.vin,
            status = vehicle.status.name, // ← se usi un enum per VehicleStatus
            kilometersTravelled = vehicle.kilometersTravelled,
            pendingCleaning = vehicle.pendingCleaning,
            pendingRepairs = vehicle.pendingRepairs,
            carModel = CarModelResponseDTO.from(vehicle.carModel)
        )
    }
}
