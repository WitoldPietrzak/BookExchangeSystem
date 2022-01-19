package org.bs.bookshare.mok.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UsersFilterRequestDTO {
    String login;
    String email;
}
