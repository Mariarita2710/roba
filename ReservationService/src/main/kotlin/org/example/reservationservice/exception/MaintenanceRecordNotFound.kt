package org.example.reservationservice.exception


class MaintenanceRecordNotFound(id: Long) : RuntimeException("Maintenance with ID $id not found")
