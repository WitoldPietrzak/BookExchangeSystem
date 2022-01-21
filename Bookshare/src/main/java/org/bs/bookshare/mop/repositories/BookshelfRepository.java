package org.bs.bookshare.mop.repositories;

import org.bs.bookshare.model.Bookshelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookshelfRepository extends JpaRepository<Bookshelf, Long> {

    String DISTANCE_FORMULA = "(6371 * acos(cos(radians(:lat)) * cos(radians(bs.locationLat)) *" +
            " cos(radians(bs.locationLong) - radians(:lon)) + sin(radians(:lat)) * sin(radians(bs.locationLat))))";

    String LOCATION_DISTANCE_QUERY = "";

    @Query("SELECT bs FROM Bookshelf bs WHERE ((:lat is null OR :lon is null OR :distance is null) OR ( (bs.locationLat is not null AND bs.locationLong is not null ) AND " + DISTANCE_FORMULA + " < :distance )) AND ( (:bookCount is null ) OR (size(bs.booksOnShelf) >= :bookCount) )")
//            "ORDER BY " + DISTANCE_FORMULA + " DESC")
    List<Bookshelf> findAllInDistance(@Param("lat") Double lat, @Param("lon") Double lon, @Param("distance") Double distance,@Param("bookCount") Integer bookCount);
}
