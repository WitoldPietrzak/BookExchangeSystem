package org.bs.bookshare.utils.converter;

import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.mok.dto.request.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.response.UserAdminResponseDTO;
import org.bs.bookshare.mok.dto.response.UserListResponseDTO;
import org.bs.bookshare.mok.dto.response.UserResponseDTO;

public class UserConverter {
    public static AppUser userFromCreateUserRequestDTO(CreateUserRequestDTO dto) {
        return new AppUser(dto.getLogin(), dto.getEmail(), dto.getPassword(), dto.getLanguage().toLowerCase());
    }

    public static UserListResponseDTO userListResponseDTOFromUser(AppUser user) {
        return new UserListResponseDTO(user.getId(), user.getLogin(), user.getEmail());
    }

    public static UserResponseDTO userResponseDTOFromUser(AppUser user) {
        return new UserResponseDTO(user.getId(), user.getLogin(), user.getEmail(), user.getVersion(), user.getLanguage());
    }

    public static UserAdminResponseDTO userAdminResponseDTOFromUser(AppUser user) {
        return new UserAdminResponseDTO(user.getId(), user.getLogin(), user.getEmail(), user.getActivated(), user.getDisabled(), user.getVersion(), user.getAppRoles(), user.getLanguage());
    }
}
