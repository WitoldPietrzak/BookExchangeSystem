package org.bs.bookshare.mok.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserListResponseDTO {
    private List<UserListElementResponseDTO> users;
}
