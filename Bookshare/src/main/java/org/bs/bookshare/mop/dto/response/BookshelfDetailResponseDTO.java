package org.bs.bookshare.mop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.BookCopy;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookshelfDetailResponseDTO {
    private Long id;
    private Float latitude;
    private Float longitude;
    private List<BookCopy> books;  //TODO DTO książki jak będzie
    private Double distance;
    private Long version;
}
