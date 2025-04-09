package org.example.reservationservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "vehicle_notes")
data class VehicleNote(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    val author: String,
    val note: String,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)
