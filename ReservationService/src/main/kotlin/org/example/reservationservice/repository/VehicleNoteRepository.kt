package org.example.reservationservice.repository

import org.example.reservationservice.model.VehicleNote
import org.springframework.data.jpa.repository.JpaRepository

interface VehicleNoteRepository : JpaRepository<VehicleNote, Long>, VehicleNoteRepositoryCustom {
    fun findByVehicleId(vehicleId: Long): List<VehicleNote>
}
