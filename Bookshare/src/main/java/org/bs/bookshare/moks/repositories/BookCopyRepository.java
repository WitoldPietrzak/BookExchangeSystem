package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCopyRepository extends JpaRepository<BookCopy,Long> {
}
