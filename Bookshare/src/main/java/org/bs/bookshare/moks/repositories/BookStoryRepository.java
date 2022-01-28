package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.BookStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Transactional(propagation = Propagation.MANDATORY)
public interface BookStoryRepository extends JpaRepository<BookStory,Long> {
}
