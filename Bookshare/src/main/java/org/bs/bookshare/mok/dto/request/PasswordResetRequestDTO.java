package org.bs.bookshare.mok.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetRequestDTO {
    private String newPassword;
    private String newPasswordConfirm;
}
