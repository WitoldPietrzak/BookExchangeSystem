package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Transactional(propagation = Propagation.MANDATORY)
public interface AuthorRepository extends JpaRepository<Author,Long> {
}
