package com.sumaresta.calc.controller;

import com.sumaresta.calc.dto.OperacionRequest;
import com.sumaresta.calc.dto.OperacionResponse;
import com.sumaresta.calc.service.CalcService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calc")
public class CalcController {

    private final CalcService calcService;

    public CalcController(CalcService calcService) {
        this.calcService = calcService;
    }

    @GetMapping("/sumar")
    public OperacionResponse sumarGet(@RequestParam double a, @RequestParam double b) {
        return calcService.sumar(a, b);
    }

    @GetMapping("/restar")
    public OperacionResponse restarGet(@RequestParam double a, @RequestParam double b) {
        return calcService.restar(a, b);
    }

    @PostMapping("/sumar")
    public OperacionResponse sumarPost(@Valid @RequestBody OperacionRequest request) {
        return calcService.sumar(request.a(), request.b());
    }

    @PostMapping("/restar")
    public OperacionResponse restarPost(@Valid @RequestBody OperacionRequest request) {
        return calcService.restar(request.a(), request.b());
    }
}
