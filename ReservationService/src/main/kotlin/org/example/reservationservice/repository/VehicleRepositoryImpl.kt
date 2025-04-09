package org.example.reservationservice.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.Predicate
import org.example.reservationservice.model.Vehicle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository

@Repository
class VehicleRepositoryImpl(
    private val entityManager: EntityManager
) : VehicleRepositoryCustom {

    override fun findAllFiltered(
        status: String?,
        carModelId: Long?,
        pageable: Pageable
    ): Page<Vehicle> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Vehicle::class.java)
        val root = query.from(Vehicle::class.java)

        val predicates = mutableListOf<Predicate>()

        status?.let {
            predicates += cb.equal(root.get<String>("status"), it)
        }

        carModelId?.let {
            predicates += cb.equal(root.get<Any>("carModel").get<Long>("id"), it)
        }

        query.where(*predicates.toTypedArray())

        val typedQuery = entityManager.createQuery(query)
        typedQuery.firstResult = pageable.offset.toInt()
        typedQuery.maxResults = pageable.pageSize
        val resultList = typedQuery.resultList

        // Count query
        val countQuery = cb.createQuery(Long::class.java)
        val countRoot = countQuery.from(Vehicle::class.java)
        countQuery.select(cb.count(countRoot))
        countQuery.where(*predicates.toTypedArray())
        val total = entityManager.createQuery(countQuery).singleResult

        return PageImpl(resultList, pageable, total)
    }
}
