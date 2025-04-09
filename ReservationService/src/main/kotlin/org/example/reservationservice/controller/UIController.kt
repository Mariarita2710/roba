package org.example.reservationservice.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class UIController {

    @GetMapping("/", "")
    fun getUI(): String {
        return "redirect:/ui/"
    }
}