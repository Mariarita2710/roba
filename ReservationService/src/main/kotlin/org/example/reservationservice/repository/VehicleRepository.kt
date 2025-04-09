package org.example.reservationservice.repository

import org.example.reservationservice.model.Vehicle
import org.springframework.data.jpa.repository.JpaRepository

interface VehicleRepository : JpaRepository<Vehicle, Long>, VehicleRepositoryCustom {
    fun findByLicensePlate(licensePlate: String): Vehicle?
    fun existsByLicensePlate(licensePlate: String): Boolean
}
