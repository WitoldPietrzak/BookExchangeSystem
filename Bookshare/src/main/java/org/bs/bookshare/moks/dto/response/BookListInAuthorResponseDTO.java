package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookListInAuthorResponseDTO {
    private Long id;
    private String title;
}
