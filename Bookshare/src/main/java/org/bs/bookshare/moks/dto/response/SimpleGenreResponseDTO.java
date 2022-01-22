package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class SimpleGenreResponseDTO {
    private Long id;
    private String nameCode;
    private Map<String,String> name;
}
