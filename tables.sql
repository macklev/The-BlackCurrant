CREATE DATABASE IF NOT EXISTS blackcurrent_database;
USE blackcurrent_database;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    handle VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT user_pk PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS profiles (
    profile_id INT AUTO_INCREMENT,
    profile_picture VARCHAR(255),
    profile_bio VARCHAR(255),
    user_id INT UNIQUE,
    CONSTRAINT profile_pk PRIMARY KEY (profile_id),
    CONSTRAINT profile_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    post_id INT AUTO_INCREMENT,
    user_id INT, 
    post_content VARCHAR(280) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT post_pk PRIMARY KEY (post_id),
    CONSTRAINT post_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_content VARCHAR(280) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comment_pk PRIMARY KEY (comment_id),
    CONSTRAINT comment_post_fk FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT comment_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friends (
    friendship_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT friendship_pk PRIMARY KEY (friendship_id),
    CONSTRAINT friendship_unique UNIQUE (user_id, friend_id),
    CONSTRAINT friendship_not_self CHECK (user_id <> friend_id),
    CONSTRAINT friendship_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT friendship_friend_fk FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE
);