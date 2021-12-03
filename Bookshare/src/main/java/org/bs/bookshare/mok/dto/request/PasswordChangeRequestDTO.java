package org.bs.bookshare.mok.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordChangeRequestDTO {
    private String oldPassword;
    private String newPassword;
    private String newPasswordMatch;
    private Long version;
}
