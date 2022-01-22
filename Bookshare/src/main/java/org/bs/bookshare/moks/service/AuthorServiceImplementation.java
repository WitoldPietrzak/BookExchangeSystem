package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AuthorException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Author;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.moks.repositories.AuthorRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorServiceImplementation implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AppUserRepository userRepository;


    @Override
    public Author getAuthor(Long id) throws AuthorException {
        return authorRepository.findById(id).orElseThrow(AuthorException::authorNotFound);
    }

    @Override
    public void createAuthor(String name, String surname) {
        Author author = new Author(name, surname);
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);
        author.setCreatedBy(creator);
        authorRepository.save(author);

    }

    @Override
    public void deleteAuthor(Long id) throws AuthorException {
        Author author = authorRepository.findById(id).orElseThrow(AuthorException::authorNotFound);
        if (author.getBooks().size() > 0) {
            throw AuthorException.cantDeleteAuthorWithBooks();
        }
        authorRepository.delete(author);
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }
}
