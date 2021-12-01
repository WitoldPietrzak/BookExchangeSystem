package org.bs.bookshare.mok.repositories;

import org.bs.bookshare.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByLogin(String login);
}
