package org.example.reservationservice.service

import org.example.reservationservice.dto.MaintenanceRecordRequestDTO
import org.example.reservationservice.dto.MaintenanceRecordResponseDTO
import org.example.reservationservice.exception.MaintenanceRecordNotFound
import org.example.reservationservice.exception.VehicleNotFound
import org.example.reservationservice.model.MaintenanceRecord
import org.example.reservationservice.repository.MaintenanceRecordRepository
import org.example.reservationservice.repository.VehicleRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime

@Service
class MaintenanceRecordService(
    private val maintenanceRecordRepository: MaintenanceRecordRepository,
    private val vehicleRepository: VehicleRepository
) {

    private val logger = LoggerFactory.getLogger(MaintenanceRecordService::class.java)

    fun findByVehicleId(vehicleId: Long): List<MaintenanceRecordResponseDTO> {
        val records = maintenanceRecordRepository.findByVehicleId(vehicleId)
        return records.map { MaintenanceRecordResponseDTO.from(it) }
    }

    fun findById(id: Long): MaintenanceRecordResponseDTO {
        val record = maintenanceRecordRepository.findById(id)
            .orElseThrow { MaintenanceRecordNotFound(id) }

        return MaintenanceRecordResponseDTO.from(record)
    }
    fun findByVehicleIdWithFilters(
        vehicleId: Long,
        type: String?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<MaintenanceRecordResponseDTO> {
        val page = maintenanceRecordRepository.findByVehicleIdWithFilters(vehicleId, type, from, to, pageable)
        return page.map { MaintenanceRecordResponseDTO.from(it) }
    }

    @Transactional
    fun create(vehicleId: Long, request: MaintenanceRecordRequestDTO): MaintenanceRecordResponseDTO {
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { VehicleNotFound(vehicleId) }

        val record = MaintenanceRecord(
            vehicle = vehicle,
            type = request.type,
            description = request.description,
            cost = request.cost,
            maintenanceDate = request.maintenanceDate ?: LocalDateTime.now()
        )

        val saved = maintenanceRecordRepository.save(record)
        logger.info("Created maintenance record ID ${saved.id} for vehicle ID ${vehicleId}")
        return MaintenanceRecordResponseDTO.from(saved)
    }

    @Transactional
    fun update(id: Long, request: MaintenanceRecordRequestDTO): MaintenanceRecordResponseDTO {
        val existing = maintenanceRecordRepository.findById(id)
            .orElseThrow { MaintenanceRecordNotFound(id) }

        val updated = existing.copy(
            type = request.type,
            description = request.description,
            cost = request.cost,
            maintenanceDate = request.maintenanceDate ?: LocalDateTime.now()
        )

        val saved = maintenanceRecordRepository.save(updated)
        logger.info("Updated maintenance record ID $id")
        return MaintenanceRecordResponseDTO.from(saved)
    }

    fun delete(id: Long) {
        if (!maintenanceRecordRepository.existsById(id)) {
            throw MaintenanceRecordNotFound(id)
        }
        maintenanceRecordRepository.deleteById(id)
        logger.info("Deleted maintenance record ID $id")
    }
}
