package org.example.reservationservice.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.Predicate
import org.example.reservationservice.model.MaintenanceRecord
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MaintenanceRecordRepositoryImpl(
    private val entityManager: EntityManager
) : MaintenanceRecordRepositoryCustom {

    override fun findByVehicleIdWithFilters(
        vehicleId: Long,
        type: String?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<MaintenanceRecord> {
        val cb = entityManager.criteriaBuilder

        // === QUERY per i risultati ===
        val query = cb.createQuery(MaintenanceRecord::class.java)
        val root = query.from(MaintenanceRecord::class.java)

        val predicates = mutableListOf<Predicate>()
        predicates += cb.equal(root.get<Any>("vehicle").get<Long>("id"), vehicleId)
        type?.let { predicates += cb.equal(root.get<String>("type"), it) }
        from?.let { predicates += cb.greaterThanOrEqualTo(root.get("maintenanceDate"), it) }
        to?.let { predicates += cb.lessThanOrEqualTo(root.get("maintenanceDate"), it) }

        query.select(root)
            .where(*predicates.toTypedArray())
            .orderBy(cb.desc(root.get<LocalDateTime>("maintenanceDate")))

        val typedQuery = entityManager.createQuery(query)
        typedQuery.firstResult = pageable.offset.toInt()
        typedQuery.maxResults = pageable.pageSize

        val resultList = typedQuery.resultList

        // === QUERY per il conteggio ===
        val countQuery = cb.createQuery(Long::class.java)
        val countRoot = countQuery.from(MaintenanceRecord::class.java)

        val countPredicates = mutableListOf<Predicate>()
        countPredicates += cb.equal(countRoot.get<Any>("vehicle").get<Long>("id"), vehicleId)
        type?.let { countPredicates += cb.equal(countRoot.get<String>("type"), it) }
        from?.let { countPredicates += cb.greaterThanOrEqualTo(countRoot.get("maintenanceDate"), it) }
        to?.let { countPredicates += cb.lessThanOrEqualTo(countRoot.get("maintenanceDate"), it) }

        countQuery.select(cb.count(countRoot))
            .where(*countPredicates.toTypedArray())

        val total = entityManager.createQuery(countQuery).singleResult

        return PageImpl(resultList, pageable, total)
    }
}
