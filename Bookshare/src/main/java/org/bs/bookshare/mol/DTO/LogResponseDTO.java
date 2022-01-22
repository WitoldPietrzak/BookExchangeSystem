package org.bs.bookshare.mol.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogResponseDTO {
    private LocalDateTime eventDate;
    private String logger;
    private String level;
    private String message;
    private String exception;
}
