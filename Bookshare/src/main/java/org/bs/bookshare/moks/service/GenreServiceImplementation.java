package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.moks.repositories.GenreRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreServiceImplementation implements GenreService {

    private final GenreRepository genreRepository;
    private final AppUserRepository userRepository;


    @Override
    public Genre addGenre(String nameCode, Map<String, String> name) throws GenreException {
        List<Genre> genres = genreRepository.findAll();
        if (genres.stream().anyMatch(g -> g.getNameCode().equals(nameCode))) {
            throw GenreException.genreExists();
        }
        if (name.isEmpty()) {
            throw GenreException.cantCreateEmptyGenre();
        }
        Genre genre = new Genre(nameCode, name);
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);
        genre.setCreatedBy(creator);

        return genreRepository.save(genre);
    }

    @Override
    public Genre findGenre(Long id) throws GenreException {
        return genreRepository.findById(id).orElseThrow(GenreException::genreNotFound);
    }

    @Override
    public Genre findGenre(String name) throws GenreException {
        Genre genre = genreRepository.findByName(name);
        if (genre == null) {
            throw GenreException.genreNotFound();
        }
        return genre;
    }

    @Override
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    public void deleteGenre(Genre genre, Long version) throws GenreException {
        if (!genre.getVersion().equals(version)) {
            throw GenreException.versionMismatch();
        }
        if (!genre.getBooks().isEmpty()) {
            throw GenreException.cantDeleteGenreUsedByBooks();
        }
        genreRepository.delete(genre);

    }
}
