package org.example.reservationservice.dto

import java.time.LocalDateTime

import org.example.reservationservice.model.VehicleNote

data class VehicleNoteResponseDTO(
    val id: Long,
    val vehicleId: Long,
    val author: String,
    val note: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(note: VehicleNote): VehicleNoteResponseDTO = VehicleNoteResponseDTO(
            id = note.id,
            vehicleId = note.vehicle.id,
            author = note.author,
            note = note.note,
            createdAt = note.createdAt
        )
    }
}

