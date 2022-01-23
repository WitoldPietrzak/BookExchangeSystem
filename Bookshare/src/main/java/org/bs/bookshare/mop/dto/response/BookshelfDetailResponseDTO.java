package org.bs.bookshare.mop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.moks.dto.response.BookCopyInnerResponseDTO;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookshelfDetailResponseDTO {
    private Long id;
    private Float latitude;
    private Float longitude;
    private List<BookCopyInBookshelfDetailResponseDTO> books;
    private Double distance;
    private Long version;
}
