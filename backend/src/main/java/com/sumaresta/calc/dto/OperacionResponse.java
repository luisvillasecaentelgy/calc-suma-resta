package com.sumaresta.calc.dto;

public record OperacionResponse(
        double a,
        double b,
        String operacion,
        double resultado
) {
}
