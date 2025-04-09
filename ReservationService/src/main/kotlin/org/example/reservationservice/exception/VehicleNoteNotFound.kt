package org.example.reservationservice.exception

class VehicleNoteNotFound(noteId: Long) : RuntimeException("Vehicle Note with ID $noteId not found")
