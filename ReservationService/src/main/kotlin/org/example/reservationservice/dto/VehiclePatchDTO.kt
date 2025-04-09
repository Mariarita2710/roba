package org.example.reservationservice.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class VehiclePatchDTO(
    @JsonProperty("status")
    val status: String? = null,

    @JsonProperty("kilometers_travelled")
    val kilometersTravelled: Int? = null,

    @JsonProperty("pending_cleaning")
    val pendingCleaning: Boolean? = null,

    @JsonProperty("pending_repairs")
    val pendingRepairs: Boolean? = null
)
