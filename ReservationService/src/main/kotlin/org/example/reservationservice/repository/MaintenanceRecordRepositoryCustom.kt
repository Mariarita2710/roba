package org.example.reservationservice.repository

import org.example.reservationservice.model.MaintenanceRecord
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime
import org.springframework.data.domain.Page

interface MaintenanceRecordRepositoryCustom {
    fun findByVehicleIdWithFilters(
        vehicleId: Long,
        type: String?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<MaintenanceRecord>
}
