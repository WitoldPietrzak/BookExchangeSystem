package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByTitle(String title);

    @Query("SELECT book FROM Book book LEFT JOIN book.genres genres WHERE (" +
            "(:title IS NULL OR book.title LIKE %:title%) " +
            "AND (:author IS NULL OR book.author.id = :author) " +
            "AND (:genres IS NULL OR genres.id IN :genres) " +
            "AND (:releasedBefore IS NULL OR book.releaseDate > :releasedBefore)" +
            "AND (:releasedAfter IS NULL OR book.releaseDate > :releasedAfter)" +
            "AND (:copyCount IS NULL OR size(book.copies) >= :copyCount)" +
            ")")
    List<Book> findAllFiltered(@Param("title") String title, @Param("author") Long author,@Param("genres") List<Long> genres,@Param("releasedBefore") Integer releasedBefore,@Param("releasedAfter") Integer releasedAfter, @Param("copyCount") Integer copyCount);
}
