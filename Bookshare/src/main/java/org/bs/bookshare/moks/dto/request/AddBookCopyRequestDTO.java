package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.CoverType;

@Data
@NoArgsConstructor
public class AddBookCopyRequestDTO {
    private Long bookId;
    private CoverType coverType;

    public AddBookCopyRequestDTO(Long bookId, String coverType) {
        this.bookId = bookId;
        this.coverType = CoverType.valueOf(coverType);
    }
}
