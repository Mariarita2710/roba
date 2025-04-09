package org.example.reservationservice.repository

import org.example.reservationservice.model.CarModel
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CarModelRepository : JpaRepository<CarModel, Long> {


    fun existsByBrandAndModel(brand: String, model: String): Boolean

    @Query("""
        SELECT c FROM CarModel c
        WHERE (:brand IS NULL OR c.brand = :brand)
          AND (:segment IS NULL OR c.segment = :segment)
          AND (:engineType IS NULL OR c.engineType = :engineType)
          AND (:transmissionType IS NULL OR c.transmissionType = :transmissionType)
          AND (:modelYear IS NULL OR c.modelYear = :modelYear)
    """)
    fun findFiltered(
        @Param("brand") brand: String?,
        @Param("segment") segment: String?,
        @Param("engineType") engineType: String?,
        @Param("transmissionType") transmissionType: String?,
        @Param("modelYear") modelYear: Int?,
        pageable: Pageable
    ): Page<CarModel>
}
