package org.bs.bookshare.mok.service;

import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;

import java.util.List;

public interface AppUserService {
    AppUser createUser(AppUser user) throws AppUserException;
    void addRoleToUser(Long id, String roleName);
    AppUser getUser(Long id);
    List<AppUser> getAllUsers();


}
