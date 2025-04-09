package org.example.reservationservice.repository

import org.example.reservationservice.model.MaintenanceRecord
import org.springframework.data.jpa.repository.JpaRepository

interface MaintenanceRecordRepository :
    JpaRepository<MaintenanceRecord, Long>,
    MaintenanceRecordRepositoryCustom {

    fun findByVehicleId(vehicleId: Long): List<MaintenanceRecord>
}
