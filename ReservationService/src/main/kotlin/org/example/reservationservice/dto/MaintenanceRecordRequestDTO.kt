package org.example.reservationservice.dto

import java.math.BigDecimal
import java.time.LocalDateTime

data class MaintenanceRecordRequestDTO(
    val vehicleId: Long,
    val type: String,
    val description: String,
    val cost: BigDecimal,
    val maintenanceDate: LocalDateTime? = null
)
