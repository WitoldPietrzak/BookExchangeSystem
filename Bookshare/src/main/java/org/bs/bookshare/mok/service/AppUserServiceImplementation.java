package org.bs.bookshare.mok.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bs.bookshare.exceptions.AppBaseException;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.mok.ejb.repositories.AppRoleRepository;
import org.bs.bookshare.mok.ejb.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
//@Slf4j
public class AppUserServiceImplementation implements AppUserService{
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    @Override
    public AppUser saveUser(AppUser user) throws AppUserException {
        List<AppUser> users = appUserRepository.findAll(); //TODO dodać wyjątki
        if(users.stream().anyMatch(u ->(u.getEmail().equals(user.getEmail())))){
            throw AppUserException.emailExists();
        }
        if(users.stream().anyMatch(u ->(u.getLogin().equals(user.getLogin())))){
            throw AppUserException.loginExists();
        }
        return appUserRepository.save(user);
    }

    @Override
    public AppRole saveRole(AppRole role) {
        return appRoleRepository.save(role);
    }

    @Override
    public void addRoleToUser(Long id, String roleName) {
        AppUser user = appUserRepository.findById(id).orElseThrow(() ->new EntityNotFoundException(id.toString()));  //TODO Wyjątki
        AppRole role = appRoleRepository.findByName(roleName);
        user.getAppRoles().add(role);

    }

    @Override
    public AppUser getUser(Long id) {
        return appUserRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id.toString()));
    }

    @Override
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }
}
