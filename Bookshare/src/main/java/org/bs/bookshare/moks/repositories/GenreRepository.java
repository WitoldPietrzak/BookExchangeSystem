package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Transactional(propagation = Propagation.MANDATORY)
public interface GenreRepository extends JpaRepository<Genre, Long> {
    Genre findByName(String name);
}
