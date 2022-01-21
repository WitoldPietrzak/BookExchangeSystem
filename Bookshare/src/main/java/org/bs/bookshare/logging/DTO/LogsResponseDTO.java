package org.bs.bookshare.logging.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogsResponseDTO {
    private List<LogResponseDTO> logs;
}