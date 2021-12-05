package org.bs.bookshare.mok.service;

import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;

import java.util.List;

public interface AppUserService {
    AppUser createUser(AppUser user) throws AppUserException;

    void addRoleToUser(Long id, String roleName) throws AppUserException;

    void revokeRoleFromUser(Long id, String roleName, String caller) throws AppUserException;

    AppUser getUser(Long id) throws AppUserException;

    AppUser getUser(String login) throws AppUserException;

    List<AppUser> getAllUsers();

    void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException;

    void disableUser(Long id, String name) throws AppUserException;

    void enableUser(Long id, String name) throws AppUserException;

    void changeLanguage(String login, String language) throws AppUserException;

    void activateUser(String token) throws AppUserException;

    void resetPassword(String token, String newPassword, String newPasswordMatch) throws AppUserException;

    void sendResetPasswordRequest(String loginOrEmail);
}
