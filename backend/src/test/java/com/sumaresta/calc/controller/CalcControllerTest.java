package com.sumaresta.calc.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CalcControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void sumarPorQuery() throws Exception {
        mockMvc.perform(get("/api/calc/sumar").param("a", "12.5").param("b", "7.5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.operacion").value("suma"))
                .andExpect(jsonPath("$.resultado").value(20.0));
    }

    @Test
    void restarPorCuerpo() throws Exception {
        mockMvc.perform(post("/api/calc/restar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"a\":10,\"b\":4}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.operacion").value("resta"))
                .andExpect(jsonPath("$.resultado").value(6.0));
    }
}
