package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author,Long> {
}
