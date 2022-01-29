package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class UpdateGenreRequestDTO {
    private Long id;
    private Map<String,String> names;
    Long version;
}
