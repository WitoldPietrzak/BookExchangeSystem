package org.bs.bookshare.mok.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.repositories.AppRoleRepository;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
//@Slf4j
public class AppUserServiceImplementation implements AppUserService, UserDetailsService {
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser createUser(AppUser user) throws AppUserException {
        List<AppUser> users = appUserRepository.findAll(); //TODO dodać wyjątki
        if (users.stream().anyMatch(u -> (u.getEmail().equals(user.getEmail())))) {
            throw AppUserException.emailExists();
        }
        if (users.stream().anyMatch(u -> (u.getLogin().equals(user.getLogin())))) {
            throw AppUserException.loginExists();
        }
        AppRole role = appRoleRepository.findByName(Roles.ROLE_USER);
        user.getAppRoles().add(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return appUserRepository.save(user);
    }


    @Override
    public void addRoleToUser(Long id, String roleName) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id.toString()));  //TODO Wyjątki
        AppRole role = appRoleRepository.findByName(roleName);
        if(user.getAppRoles().contains(role)){
            throw AppUserException.roleExists();
        }
        user.getAppRoles().add(role);

    }

    @Override
    public AppUser getUser(Long id) {
        return appUserRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id.toString()));
    }

    @Override
    public AppUser getUser(String login) {
        return appUserRepository.findByLogin(login); //TODO Wyjątki
    }

    @Override
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException {
        AppUser user = appUserRepository.findByLogin(login);
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (!newPassword.equals(newPasswordMatch)) {
            throw AppUserException.passwordsDontMatch();
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw AppUserException.IncorrectPassword();
        }
        if (oldPassword.equals(newPassword)) {
            throw AppUserException.passwordUsed();
        }
        user.setPassword(passwordEncoder.encode(newPassword));       //TODO Wyjątki
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByLogin(login);
        if (user == null) {
            throw new UsernameNotFoundException(login);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getAppRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new User(user.getLogin(), user.getPassword(), user.getActivated(), true, true, !user.getDisabled(), authorities);
    }
}
