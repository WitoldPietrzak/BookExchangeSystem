package org.bs.bookshare.mok.repositories;

import org.bs.bookshare.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(propagation = Propagation.MANDATORY)
public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByLogin(String login);
    AppUser findByEmail(String email);

    @Query("SELECT DISTINCT u FROM AppUser u WHERE (:login is NULL or u.login LIKE "+"%"+":login"+"%"+") AND (:email is NULL or u.email LIKE "+"%"+":email"+"%"+")")
    List<AppUser> findAllFilterByLoginAndEmail(@Param("login") String login, @Param("email") String email);

    @Query("SELECT DISTINCT u FROM AppUser  u JOIN FETCH u.appRoles WHERE u.login = (:login)")
    AppUser findByLoginAndFetchRolesEagerly(@Param("login") String login);
}
