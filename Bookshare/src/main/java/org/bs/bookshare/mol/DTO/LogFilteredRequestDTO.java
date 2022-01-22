package org.bs.bookshare.mol.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogFilteredRequestDTO {
    private String level;
    private LocalDateTime after;
    private LocalDateTime before;
}
