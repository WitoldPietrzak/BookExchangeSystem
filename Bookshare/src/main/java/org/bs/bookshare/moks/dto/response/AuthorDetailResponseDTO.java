package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDetailResponseDTO {
    private String name;
    private String surname;
    private List<BookListInAuthorResponseDTO> books;
}
