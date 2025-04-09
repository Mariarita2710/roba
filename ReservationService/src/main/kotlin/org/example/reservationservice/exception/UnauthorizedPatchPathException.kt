package org.example.reservationservice.exception

class UnauthorizedPatchPathException(fieldPath: String) :
    RuntimeException("Modification of field '$fieldPath' is not allowed.")
