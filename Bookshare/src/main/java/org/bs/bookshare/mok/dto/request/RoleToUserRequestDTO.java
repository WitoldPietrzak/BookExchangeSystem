package org.bs.bookshare.mok.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoleToUserRequestDTO {
    Long userId;
    String roleName;
}