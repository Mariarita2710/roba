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
      AND (:model IS NULL OR c.model = :model)
      AND (:segment IS NULL OR c.segment = :segment)
      AND (:engineType IS NULL OR c.engineType = :engineType)
      AND (:transmissionType IS NULL OR c.transmissionType = :transmissionType)
      AND (:modelYear IS NULL OR c.modelYear = :modelYear)
      AND (:minPrice IS NULL OR c.rentalPricePerDay >= :minPrice)
      AND (:maxPrice IS NULL OR c.rentalPricePerDay <= :maxPrice)
""")
    fun findFiltered(
        @Param("brand") brand: String?,
        @Param("model") model: String?,
        @Param("segment") segment: String?,
        @Param("engineType") engineType: String?,
        @Param("transmissionType") transmissionType: String?,
        @Param("modelYear") modelYear: Int?,
        @Param("minPrice") minPrice: Double?,
        @Param("maxPrice") maxPrice: Double?,
        pageable: Pageable
    ): Page<CarModel>


}
