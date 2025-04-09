package org.example.reservationservice.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.Predicate
import org.example.reservationservice.model.VehicleNote
import org.example.reservationservice.model.Vehicle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
@Repository
class VehicleNoteRepositoryImpl(
    private val entityManager: EntityManager
) : VehicleNoteRepositoryCustom {

    override fun findByVehicleIdWithFilters(
        vehicleId: Long,
        author: String?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<VehicleNote> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(VehicleNote::class.java)
        val root = query.from(VehicleNote::class.java)

        val predicates = mutableListOf<Predicate>()

        // JOIN corretto su vehicle
        val vehicleJoin = root.join<VehicleNote, Vehicle>("vehicle")
        predicates += cb.equal(vehicleJoin.get<Long>("id"), vehicleId)

        author?.let {
            predicates += cb.like(cb.lower(root.get("author")), "%${it.lowercase()}%")
        }

        from?.let {
            predicates += cb.greaterThanOrEqualTo(root.get("createdAt"), it)
        }

        to?.let {
            predicates += cb.lessThanOrEqualTo(root.get("createdAt"), it)
        }

        query.where(*predicates.toTypedArray())
        query.orderBy(cb.desc(root.get<LocalDateTime>("createdAt")))

        val typedQuery = entityManager.createQuery(query)
        typedQuery.firstResult = pageable.offset.toInt()
        typedQuery.maxResults = pageable.pageSize

        val results = typedQuery.resultList

        // COUNT QUERY con stesso join
        val countQuery = cb.createQuery(Long::class.java)
        val countRoot = countQuery.from(VehicleNote::class.java)
        val countVehicleJoin = countRoot.join<VehicleNote, Vehicle>("vehicle")
        val countPredicates = mutableListOf<Predicate>()
        countPredicates += cb.equal(countVehicleJoin.get<Long>("id"), vehicleId)

        author?.let {
            countPredicates += cb.like(cb.lower(countRoot.get("author")), "%${it.lowercase()}%")
        }

        from?.let {
            countPredicates += cb.greaterThanOrEqualTo(countRoot.get("createdAt"), it)
        }

        to?.let {
            countPredicates += cb.lessThanOrEqualTo(countRoot.get("createdAt"), it)
        }

        countQuery.select(cb.count(countRoot)).where(*countPredicates.toTypedArray())
        val total = entityManager.createQuery(countQuery).singleResult

        return PageImpl(results, pageable, total)
    }
}
