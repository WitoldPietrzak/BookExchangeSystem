package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenreResponseDTO {
    private Long id;
    private String nameCode;
    private Map<String,String> name;
    private Integer usageCount;
    private Long version;
}
