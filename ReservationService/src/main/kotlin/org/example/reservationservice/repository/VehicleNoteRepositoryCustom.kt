package org.example.reservationservice.repository

import org.example.reservationservice.model.VehicleNote
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime

interface VehicleNoteRepositoryCustom {
    fun findByVehicleIdWithFilters(
        vehicleId: Long,
        author: String?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<VehicleNote>
}
