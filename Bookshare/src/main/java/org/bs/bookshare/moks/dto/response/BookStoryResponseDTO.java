package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.BookActionType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookStoryResponseDTO {
    BookActionType action;
    String user;
    LocalDateTime date;
    Double lat1;
    Double lng1;
    Double lat2;
    Double lng2;

}
