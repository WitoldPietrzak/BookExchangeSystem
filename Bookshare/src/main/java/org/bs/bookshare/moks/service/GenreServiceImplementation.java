package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.moks.repositories.GenreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreServiceImplementation implements GenreService {

    private final GenreRepository genreRepository;

    @Override
    public Genre addGenre(Genre genre) throws GenreException {
        List<Genre> genres = genreRepository.findAll();
        if (genres.stream().anyMatch(g -> g.getName().equals(genre.getName()))) {
            throw GenreException.genreExists();
        }
        return genreRepository.save(genre);
    }

    @Override
    public Genre findGenre(Long id) throws GenreException {
        return genreRepository.findById(id).orElseThrow(GenreException::genreNotFound);
    }

    @Override
    public Genre findGenre(String name) throws GenreException {
        Genre genre = genreRepository.findByName(name);
        if(genre == null){
            throw GenreException.genreNotFound();
        }
        return genre;
    }

    @Override
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
}
