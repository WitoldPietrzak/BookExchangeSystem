package org.bs.bookshare.mop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.moks.dto.response.AuthorInnerResponseDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopyInBookshelfDetailResponseDTO {
    private Long id;
    private String title;
    private boolean isAvailable;
    private String coverType;
    private AuthorInnerResponseDTO author;
    private String language;
}
