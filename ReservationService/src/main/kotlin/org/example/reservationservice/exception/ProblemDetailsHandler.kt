package org.example.reservationservice.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ProblemDetailsHandler {

    @ExceptionHandler(DuplicateCarModel::class)
    fun handleDuplicateCarModel(e: DuplicateCarModel): ProblemDetail {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.message ?: "Duplicate car model")
    }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(e: NoSuchElementException): ProblemDetail {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Not found")
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(e: Exception): ProblemDetail {
        e.printStackTrace() // utile in fase di debug
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.message ?: "Unexpected error")
    }

    @ExceptionHandler(CarModelNotFoundException::class)
    fun handleCarModelNotFound(e: CarModelNotFoundException): ProblemDetail {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Car model not found")
    }

    @ExceptionHandler(DuplicateVehicleException::class)
    fun handleDuplicateVehicle(e: DuplicateVehicleException): ProblemDetail =
        ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.message ?: "Duplicate vehicle")
}
