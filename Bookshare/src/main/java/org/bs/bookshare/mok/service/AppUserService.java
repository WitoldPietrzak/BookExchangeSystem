package org.bs.bookshare.mok.service;

import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;

import java.util.List;
import java.util.Map;

public interface AppUserService {
    AppUser createUser(String login, String email, String password, String language) throws AppUserException;

    void addRoleToUser(Long id, String roleName) throws AppUserException;

    void revokeRoleFromUser(Long id, String roleName) throws AppUserException;

    AppUser getUser(Long id) throws AppUserException;

    AppUser getUserWithRoles(String login) throws AppUserException;

    AppUser getUser(String login) throws AppUserException;

    List<AppUser> getAllUsers();

    public List<AppUser> getFilteredUsers(String login, String email);

    void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException;

    void disableUser(Long id, String name) throws AppUserException;

    void enableUser(Long id, String name) throws AppUserException;

    void changeLanguage(String login, String language) throws AppUserException;

    void activateUser(String token) throws AppUserException;

    void resetPassword(String token, String newPassword, String newPasswordMatch) throws AppUserException;

    public void verifyPasswordResetToken(String token) throws AppUserException;

    void sendResetPasswordRequest(String loginOrEmail);

    void registerLoginAttempt(Long id, Boolean success) throws AppUserException;

    void enableUserByToken(String token) throws AppUserException;

    Map<String, Object> refreshToken(String jwt) throws AppUserException;
}
