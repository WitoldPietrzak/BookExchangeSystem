package org.bs.bookshare.mok.repositories;

import org.bs.bookshare.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByLogin(String login);

    @Query("SELECT u FROM AppUser  u JOIN FETCH u.appRoles WHERE u.login = (:login)")
    AppUser findByLoginAndFetchRolesEagerly(@Param("login") String login);
}
