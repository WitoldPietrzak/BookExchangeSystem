package org.bs.bookshare.mok.repositories;

import org.bs.bookshare.model.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
    AppRole findByName(String name);
}
