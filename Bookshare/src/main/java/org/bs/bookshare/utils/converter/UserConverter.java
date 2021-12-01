package org.bs.bookshare.utils.converter;

import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.mok.dto.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.UserListResponseDTO;

public class UserConverter {
    public static AppUser userFromCreateUserRequestDTO(CreateUserRequestDTO dto){
        return new AppUser(dto.getLogin(), dto.getEmail(), dto.getPassword());
    }

    public static UserListResponseDTO UserListResponseDTOFromUser(AppUser user){
        return new UserListResponseDTO(user.getId(),user.getLogin(),user.getEmail());
    }
}
