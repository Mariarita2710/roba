package org.example.reservationservice.dto

import org.example.reservationservice.model.MaintenanceRecord
import java.math.BigDecimal
import java.time.LocalDateTime

data class MaintenanceRecordResponseDTO(
    val id: Long,
    val vehicleId: Long,
    val maintenanceDate: LocalDateTime,
    val type: String,
    val description: String,
    val cost: BigDecimal
){
    companion object {
        fun from(record: MaintenanceRecord): MaintenanceRecordResponseDTO {
            return MaintenanceRecordResponseDTO(
                id = record.id,
                vehicleId = record.vehicle.id,
                maintenanceDate = record.maintenanceDate,
                type = record.type,
                description = record.description,
                cost = record.cost
            )
        }
    }}
