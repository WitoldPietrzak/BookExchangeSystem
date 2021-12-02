DROP TABLE IF EXISTS user_table_app_roles;
DROP TABLE IF EXISTS user_table;
DROP TABLE IF EXISTS role_table;

DROP SEQUENCE IF EXISTS user_seq;

CREATE TABLE user_table
(
    id    BIGINT PRIMARY KEY,
    login VARCHAR(50)  NOT NULL CONSTRAINT login_unique UNIQUE,
    email VARCHAR(100) NOT NULL CONSTRAINT email_unique UNIQUE,
    password CHAR(60) NOT NULL,
    activated BOOL DEFAULT FALSE NOT NULL,
    disabled BOOL DEFAULT FALSE NOT NULL,
    last_successful_login                     TIMESTAMPTZ,
    last_successful_login_ip                  VARCHAR(256),
    last_unsuccessful_login                   TIMESTAMPTZ,
    last_unsuccessful_login_ip                VARCHAR(256),
    login_attempts INT  DEFAULT 0 CONSTRAINT attempts_ge0 CHECK ( login_attempts >=0 ),
    modified_by                               BIGINT,
    modification_date_time                    TIMESTAMPTZ,
    modified_by_ip                            VARCHAR(256),
    created_by                                BIGINT,
    creation_date_time                        TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,                                             -- Data utworzenia konta
    created_by_ip                             VARCHAR(256),

    version BIGINT
);

CREATE SEQUENCE user_seq -- Sekwencja wykorzystywana przy tworzeniu pola klucza głównego tabeli account
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;

CREATE TABLE role_table(
    id BIGINT PRIMARY KEY,
    role_name VARCHAR(32) NOT NULL CONSTRAINT role_check CHECK ( role_name in ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR') ) UNIQUE
);

INSERT INTO role_table(id, role_name) VALUES (1, 'ROLE_USER');
INSERT INTO role_table(id, role_name) VALUES (2, 'ROLE_ADMIN');
INSERT INTO role_table(id, role_name) VALUES (3, 'ROLE_MODERATOR');

create table user_table_app_roles
(
    app_user_id  BIGINT NOT NULL
        CONSTRAINT ref_user REFERENCES user_table,
    app_roles_id BIGINT NOT NULL CONSTRAINT ref_role REFERENCES role_table
);