package com.sumaresta.calc.service;

import com.sumaresta.calc.dto.OperacionResponse;
import org.springframework.stereotype.Service;

@Service
public class CalcService {

    public OperacionResponse sumar(double a, double b) {
        return new OperacionResponse(a, b, "suma", a + b);
    }

    public OperacionResponse restar(double a, double b) {
        return new OperacionResponse(a, b, "resta", a - b);
    }
}
