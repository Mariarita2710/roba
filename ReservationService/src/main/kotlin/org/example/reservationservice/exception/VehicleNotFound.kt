package org.example.reservationservice.exception

class VehicleNotFound(id: Long) : RuntimeException("Vehicle with ID $id not found")
