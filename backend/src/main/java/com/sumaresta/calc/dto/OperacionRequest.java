package com.sumaresta.calc.dto;

import jakarta.validation.constraints.NotNull;

public record OperacionRequest(
        @NotNull(message = "El valor a es obligatorio") Double a,
        @NotNull(message = "El valor b es obligatorio") Double b
) {
}
