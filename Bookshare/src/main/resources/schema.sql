DROP TABLE IF EXISTS book_story_table;
DROP TABLE IF EXISTS book_copy_table;
DROP TABLE IF EXISTS genre_translations_table;
DROP TABLE IF EXISTS book_table_genres;
DROP TABLE IF EXISTS genre_table;
DROP TABLE IF EXISTS book_table;
DROP TABLE IF EXISTS book_review_table;
DROP TABLE IF EXISTS bookshelf_table;
DROP TABLE IF EXISTS author_table;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS user_table_app_roles;
DROP TABLE IF EXISTS user_table;
DROP TABLE IF EXISTS role_table;


DROP SEQUENCE IF EXISTS user_seq;
DROP SEQUENCE IF EXISTS author_seq;
DROP SEQUENCE IF EXISTS book_seq;
DROP SEQUENCE IF EXISTS book_copy_seq;
DROP SEQUENCE IF EXISTS book_review_seq;
DROP SEQUENCE IF EXISTS bookshelf_seq;
DROP SEQUENCE IF EXISTS book_story_seq;
DROP SEQUENCE IF EXISTS genre_seq;

CREATE TABLE logs
(
    id        BIGSERIAL PRIMARY KEY,
    eventdate TIMESTAMPTZ DEFAULT NULL,
    logger    VARCHAR(100),
    level     VARCHAR(100),
    message   TEXT,
    exception VARCHAR(100)
);

CREATE TABLE role_table
(
    id        BIGINT PRIMARY KEY,
    role_name VARCHAR(32) NOT NULL
        CONSTRAINT role_check CHECK ( role_name in ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR') ) UNIQUE
);


CREATE TABLE user_table
(
    id                         BIGINT PRIMARY KEY,
    login                      VARCHAR(50)        NOT NULL
        CONSTRAINT login_unique UNIQUE,
    email                      VARCHAR(100)       NOT NULL
        CONSTRAINT email_unique UNIQUE,
    password                   CHAR(60)           NOT NULL,
    activated                  BOOL DEFAULT FALSE NOT NULL,
    disabled                   BOOL DEFAULT FALSE NOT NULL,
    last_successful_login      TIMESTAMPTZ,
    last_successful_login_ip   VARCHAR(256),
    last_unsuccessful_login    TIMESTAMPTZ,
    last_unsuccessful_login_ip VARCHAR(256),
    login_attempts             INT  DEFAULT 0
        CONSTRAINT attempts_ge0 CHECK ( login_attempts >= 0 ),
    modified_by                BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time     TIMESTAMPTZ,
    modified_by_ip             VARCHAR(256),
    created_by                 BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time         TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip              VARCHAR(256),
    language                   CHAR(2),
    version                    BIGINT
);

CREATE SEQUENCE user_seq
    START WITH 10000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE SEQUENCE author_seq
    START WITH 20000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE SEQUENCE book_seq
    START WITH 30000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE SEQUENCE book_copy_seq
    START WITH 40000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

-- CREATE SEQUENCE book_review_seq
--     START WITH 50000
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE CACHE 1;

CREATE SEQUENCE bookshelf_seq
    START WITH 60000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;
CREATE SEQUENCE book_story_seq
    START WITH 70000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE SEQUENCE genre_seq
    START WITH 80000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE TABLE user_table_app_roles
(
    app_user_id  BIGINT NOT NULL
        CONSTRAINT ref_user REFERENCES user_table,
    app_roles_id BIGINT NOT NULL
        CONSTRAINT ref_role REFERENCES role_table
);

ALTER TABLE user_table_app_roles
    ADD CONSTRAINT user_role_unique_comb UNIQUE (app_user_id, app_roles_id);



CREATE TABLE genre_table
(
    id                     BIGINT PRIMARY KEY,
    name_code              VARCHAR(200) UNIQUE NOT NULL,
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),

    version                BIGINT
);

CREATE TABLE genre_translations_table
(
    genre       BIGINT      NOT NULL,
    FOREIGN KEY (genre) REFERENCES genre_table (id),
    language    CHAR(2)     NOT NULL,
    translation VARCHAR(64) NOT NULL
);
ALTER TABLE genre_translations_table
    ADD CONSTRAINT genre_lang_unique_comb UNIQUE (genre, language);

CREATE TABLE author_table
(
    id                     BIGINT PRIMARY KEY,
    name                   VARCHAR(50) NOT NULL,
    surname                VARCHAR(50) NOT NULL,
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),

    version                BIGINT
);

CREATE TABLE book_table
(
    id                     BIGINT PRIMARY KEY,
    title                  VARCHAR(200) NOT NULL,
    author                 BIGINT,
    FOREIGN KEY (author) REFERENCES author_table (id),
    release_date           INT,
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),

    version                BIGINT
);

CREATE TABLE bookshelf_table
(
    id                     BIGINT PRIMARY KEY,
    location_lat           DECIMAL(8, 6) NOT NULL,
    location_long          DECIMAL(9, 6) NOT NULL,
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),

    version                BIGINT
);

CREATE TABLE book_copy_table
(
    id                     BIGINT PRIMARY KEY,
    book                   BIGINT      NOT NULL,
    FOREIGN KEY (book) REFERENCES book_table (id),
    bookshelf              BIGINT,
    FOREIGN KEY (bookshelf) REFERENCES bookshelf_table (id),
    owner                  BIGINT,
    FOREIGN KEY (owner) REFERENCES user_table (id),
    reserved               BIGINT,
    FOREIGN KEY (reserved) REFERENCES user_table (id),
    cover                  VARCHAR(8)  NOT NULL
        CONSTRAINT cover_heck CHECK ( cover in ('HARD', 'SOFT', 'CUSTOM') ),
    reserved_until         TIMESTAMPTZ,
    language               CHAR(2)     NOT NULL,
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),

    version                BIGINT
);
CREATE TABLE book_table_genres
(
    book_id   BIGINT NOT NULL
        CONSTRAINT ref_genre REFERENCES book_table (id),
    genres_id BIGINT NOT NULL
        CONSTRAINT ref_role REFERENCES genre_table (id)
);


-- CREATE TABLE book_review_table
-- (
--     id                     BIGINT PRIMARY KEY,
--     review                 VARCHAR(1000),
--     rating                 BIGINT,
--     modified_by            BIGINT,
--     FOREIGN KEY (modified_by) REFERENCES user_table (id),
--     modification_date_time TIMESTAMPTZ,
--     modified_by_ip         VARCHAR(256),
--     created_by             BIGINT,
--     FOREIGN KEY (created_by) REFERENCES user_table (id),
--     creation_date_time     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     created_by_ip          VARCHAR(256),
--
--     version                BIGINT
-- );

CREATE TABLE book_story_table
(
    id                     BIGINT PRIMARY KEY,
    book                   BIGINT      NOT NULL,
    FOREIGN KEY (book) REFERENCES book_copy_table (id),
    action                 VARCHAR(10),
    CONSTRAINT action_heck CHECK ( action in ('CREATED', 'MOVED', 'PUT', 'TAKEN') ),
    lat1                   DECIMAL(8, 6),
    lng1                   DECIMAL(9, 6),
    lat2                   DECIMAL(8, 6),
    lng2                   DECIMAL(9, 6),
    modified_by            BIGINT,
    FOREIGN KEY (modified_by) REFERENCES user_table (id),
    modification_date_time TIMESTAMPTZ,
    modified_by_ip         VARCHAR(256),
    created_by             BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_table (id),
    creation_date_time     TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_ip          VARCHAR(256),
    version                BIGINT
);



INSERT INTO role_table(id, role_name)
VALUES (1, 'ROLE_USER');
INSERT INTO role_table(id, role_name)
VALUES (2, 'ROLE_ADMIN');
INSERT INTO role_table(id, role_name)
VALUES (3, 'ROLE_MODERATOR');

