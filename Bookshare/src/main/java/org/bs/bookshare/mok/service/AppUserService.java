package org.bs.bookshare.mok.service;

import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;

import java.util.List;

public interface AppUserService {
    AppUser createUser(AppUser user) throws AppUserException;

    void addRoleToUser(Long id, String roleName) throws AppUserException;

    void revokeRoleFromUser(Long id,String roleName, String caller) throws AppUserException;

    AppUser getUser(Long id);

    AppUser getUser(String login);

    List<AppUser> getAllUsers();

    void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException;
}
