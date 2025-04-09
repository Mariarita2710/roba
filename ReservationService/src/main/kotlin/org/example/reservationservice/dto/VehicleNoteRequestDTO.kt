package org.example.reservationservice.dto

import java.time.LocalDateTime

data class VehicleNoteRequestDTO(
    val author: String,
    val note: String,
    val createdAt: LocalDateTime? = null
)
