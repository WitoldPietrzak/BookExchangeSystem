package org.bs.bookshare.mok.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshResponseDTO {
    private String refreshToken;
    private String accessToken;
    private List<String> roles;
}
