package org.example.reservationservice.repository

import org.example.reservationservice.model.Vehicle
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface VehicleRepositoryCustom {
    fun findAllFiltered(
        status: String?,
        carModelId: Long?,
        pageable: Pageable
    ): Page<Vehicle>
}
