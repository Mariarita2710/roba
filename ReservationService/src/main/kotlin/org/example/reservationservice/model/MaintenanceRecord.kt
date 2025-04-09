package org.example.reservationservice.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "maintenance_record")
data class MaintenanceRecord(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    @Column(name = "maintenance_date")
    val maintenanceDate: LocalDateTime = LocalDateTime.now(),

    val type: String,
    val description: String,

    @Column(precision = 10, scale = 2)
    val cost: BigDecimal
)
