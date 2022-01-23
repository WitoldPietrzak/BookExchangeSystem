package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.CoverType;
import org.bs.bookshare.mop.dto.response.BookshelfResponseDTO;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopyResponseDTO {
    private Long id;
    private SimpleBookResponseDTO book;
    private String ownerUsername;
    private BookshelfResponseDTO bookshelfResponseDTO;
    private String reservedUsername;
    private String reservedUntil;
    private String coverType;
    private String language;
    private Long version;
}
