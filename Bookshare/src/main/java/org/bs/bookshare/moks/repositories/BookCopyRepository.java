package org.bs.bookshare.moks.repositories;

import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.CoverType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(propagation = Propagation.MANDATORY)
public interface BookCopyRepository extends JpaRepository<BookCopy,Long> {





    @Query("SELECT DISTINCT bc FROM BookCopy bc JOIN bc.book book LEFT JOIN book.genres genres WHERE  (" +
            "(:title IS NULL OR book.title LIKE %:title%) " +
            "AND (:book IS NULL OR book.id = :book) " +
            "AND (:author IS NULL OR book.author.id = :author) " +
            "AND ((:genres) IS NULL OR genres.id IN (:genres)) " +
            "AND (:releasedBefore IS NULL OR book.releaseDate > :releasedBefore) " +
            "AND (:releasedAfter IS NULL OR book.releaseDate > :releasedAfter) " +
            "AND (:language IS NULL OR bc.language = :language) " +
            "AND (:coverType IS NULL OR bc.coverType = :coverType) " +
            "AND (:availability IS NULL OR ((bc.owner IS NULL AND bc.reserved IS NULL AND :availability = TRUE ) OR ((bc.owner IS NOT NULL OR bc.reserved IS NOT NULL) AND :availability = FALSE )  ) ) " +
            ") GROUP BY bc HAVING COUNT(genres) >=:genresListSize")
    List<BookCopy>findAllFiltered(@Param("book")Long book, @Param("title") String title, @Param("author") Long author, @Param("genres") List<Long> genres, @Param("releasedBefore") Integer releasedBefore, @Param("releasedAfter") Integer releasedAfter, @Param("language") String language, @Param("coverType") CoverType coverType, @Param("availability") Boolean availability,@Param("genresListSize") Long genresListSize);



    String DISTANCE_FORMULA = "(6371 * acos(cos(radians(:lat)) * cos(radians(bs.locationLat)) *" +
            " cos(radians(bs.locationLong) - radians(:lng)) + sin(radians(:lat)) * sin(radians(bs.locationLat))))";

    @Query("SELECT DISTINCT bc FROM BookCopy bc JOIN bc.book book JOIN bc.bookshelf bs LEFT JOIN book.genres genres WHERE  (" +
            "(:title IS NULL OR book.title LIKE %:title%) " +
            "AND (:book IS NULL OR book.id = :book) " +
            "AND (:author IS NULL OR book.author.id = :author) " +
            "AND ((:genres) IS NULL OR genres.id IN (:genres)) " +
            "AND (:releasedBefore IS NULL OR book.releaseDate > :releasedBefore) " +
            "AND (:releasedAfter IS NULL OR book.releaseDate > :releasedAfter) " +
            "AND (:language IS NULL OR bc.language = :language) " +
            "AND (:coverType IS NULL OR bc.coverType = :coverType) " +
            "AND (:availability IS NULL OR ((bc.owner IS NULL AND bc.reserved IS NULL AND :availability = TRUE ) OR ((bc.owner IS NOT NULL OR bc.reserved IS NOT NULL) AND :availability = FALSE )  ) ) " +
            "AND (bs IS NULL OR  "+DISTANCE_FORMULA+" <:distance) " +
            ") GROUP BY bc HAVING COUNT(genres) >=:genresListSize")
    List<BookCopy> findAllFilteredWithLocation(@Param("book")Long book, @Param("title") String title, @Param("author") Long author, @Param("genres") List<Long> genres, @Param("releasedBefore") Integer releasedBefore,
                                               @Param("releasedAfter") Integer releasedAfter, @Param("language") String language, @Param("coverType") CoverType coverType, @Param("availability") Boolean availability,
                                               @Param("genresListSize") Long genresListSize,@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance);
}
