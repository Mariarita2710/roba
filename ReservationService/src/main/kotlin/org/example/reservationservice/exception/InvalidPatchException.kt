package org.example.reservationservice.exception

class InvalidPatchException(
    message: String = "Invalid JSON Patch operation.",
    cause: Throwable? = null
) : RuntimeException(message, cause)
