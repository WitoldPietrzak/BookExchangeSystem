INSERT INTO user_table(id, login, email, password, activated, disabled, created_by, version, language)
VALUES (-1, 'exampleAdmin', 'example1@email.com', '$2a$10$JpIP9xrCNf5O69TxvbD6J.n19RUJM5dXSxMWkETRIr/N/CGkO1WT.', true,
        false, -1, 0, 'pl'),
       (-2, 'exampleMod', 'example2@email.com', '$2a$10$JpIP9xrCNf5O69TxvbD6J.n19RUJM5dXSxMWkETRIr/N/CGkO1WT.', true,
        false, -2, 0, 'pl'),
       (-3, 'exampleUser', 'example3@email.com', '$2a$10$JpIP9xrCNf5O69TxvbD6J.n19RUJM5dXSxMWkETRIr/N/CGkO1WT.', true,
        false, -3, 0, 'pl');

INSERT INTO user_table_app_roles(app_user_id, app_roles_id)
VALUES (-1, 2),
       (-2, 3),
       (-3, 1);

INSERT INTO author_table(id, name, surname, created_by, version)
VALUES (-101, 'Adam', 'Mickiewicz', -2, 0),
       (-102, 'Henryk', 'Sienkiewicz', -2, 0),
       (-103, 'Juliusz', 'Słowacki', -2, 0),
       (-104, 'William', 'Szekspir', -2, 0),
       (-105, 'J.R.R.', 'Tolkien', -2, 0);
;

INSERT INTO genre_table(id, name_code, created_by, version)
VALUES (-201, 'DRAMA', -2, 0),
       (-202, 'Comedy', -2, 0),
       (-203, 'NOVEL', -2, 0),
       (-204, 'POEM', -2, 0),
       (-205, 'FANTASY', -2, 0)
;

INSERT INTO genre_translations_table(genre, language, translation)
VALUES (-201, 'PL', 'Dramat'),
       (-201, 'EN', 'Drama'),
       (-202, 'PL', 'Komedia'),
       (-202, 'EN', 'Comedy'),
       (-203, 'PL', 'Powieść'),
       (-203, 'EN', 'Novel'),
       (-204, 'PL', 'Poeamt'),
       (-204, 'EN', 'Poem'),
       (-205, 'PL', 'Fantastyka'),
       (-205, 'EN', 'Fantasy');

INSERT INTO bookshelf_table(id, location_lat, location_long, created_by, version)
VALUES (-301, 51.870252, 19.479327, -2, 0),
       (-302, 51.770252, 19.423927, -2, 0),
       (-303, 51.820252, 19.483927, -2, 0),
       (-304, 51.730252, 19.413927, -2, 0),
       (-305, 51.760252, 19.513927, -2, 0);

INSERT INTO book_table(id, title, author, release_date, created_by, version)
VALUES (-401, 'Pan Tadeusz', -101, 1834, -2, 0),
       (-402, 'Dziady część II', -101, 1823, -2, 0),
       (-403, 'Potop', -102, 1886, -2, 0),
       (-404, 'W pustyni i w puszczy', -102, 1911, -2, 0),
       (-405, 'Kordian', -103, 1834, -2, 0),
       (-406, 'Balladyna', -103, 1839, -2, 0),
       (-407, 'Hamlet', -104, 1606, -2, 0),
       (-408, 'Makbet', -104, 1603, -2, 0),
       (-409, 'Hobbit', -105, 1937, -2, 0),
       (-410, 'Dwie wieże', -105, 1954, -2, 0);

INSERT INTO book_table_genres(book_id, genres_id)
VALUES (-401, -201),
       (-402, -202),
       (-403, -203),
       (-404, -202),
       (-405, -203),
       (-406, -202),
       (-407, -204),
       (-408, -203),
       (-409, -205),
       (-410, -205),
       (-401, -204),
       (-402, -203),
       (-403, -201),
       (-404, -203),
       (-405, -201);

INSERT INTO book_copy_table(id, book, bookshelf, owner, reserved, cover, reserved_until, language, created_by, version)
VALUES (-501, -401, -301, null, null, 'HARD', null, 'pl', -3, 0),
       (-502, -402, -302, null, null, 'HARD', null, 'pl', -3, 0),
       (-503, -403, -303, null, null, 'CUSTOM', null, 'pl', -3, 0),
       (-504, -404, -304, null, null, 'HARD', null, 'pl', -3, 0),
       (-505, -405, -305, null, null, 'SOFT', null, 'en', -3, 0),
       (-506, -406, -302, null, null, 'HARD', null, 'en', -3, 0),
       (-507, -407, -303, null, null, 'SOFT', null, 'pl', -3, 0),
       (-508, -408, null, -3, null, 'HARD', null, 'en', -3, 0),
       (-509, -409, null, -3, null, 'CUSTOM', null, 'pl', -3, 0),
       (-510, -410, null, -3, null, 'HARD', null, 'en', -3, 0);

INSERT INTO book_story_table(id, book, action, lat1, lng1, lat2, lng2, created_by, version)
VALUES (-601, -501, 'CREATED', null, null, null, null, -3, 0),
       (-602, -502, 'CREATED', null, null, null, null, -3, 0),
       (-603, -503, 'CREATED', null, null, null, null, -3, 0),
       (-604, -504, 'CREATED', null, null, null, null, -3, 0),
       (-605, -505, 'CREATED', null, null, null, null, -3, 0),
       (-606, -506, 'CREATED', null, null, null, null, -3, 0),
       (-607, -507, 'CREATED', null, null, null, null, -3, 0),
       (-608, -508, 'CREATED', null, null, null, null, -3, 0),
       (-609, -509, 'CREATED', null, null, null, null, -3, 0),
       (-610, -510, 'CREATED', null, null, null, null, -3, 0),
       (-611, -501, 'MOVED', null, null, null, null, -2, 0),
       (-612, -501, 'PUT', null, null, null, null, -3, 0),
       (-613, -501, 'TAKEN', null, null, null, null, -3, 0),
       (-614, -501, 'PUT', null, null, null, null, -3, 0),
       (-615, -501, 'MOVED', null, null, null, null, -2, 0);
