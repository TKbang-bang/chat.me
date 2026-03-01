CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE chat_type AS ENUM ('direct', 'group');
CREATE TYPE participant_role AS ENUM ('admin', 'member');

CREATE TABLE IF NOT EXISTS users  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pending_users  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    verify_code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 minutes'
);

CREATE TABLE IF NOT EXISTS user_profiles  (
    user_id UUID PRIMARY KEY
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    picture TEXT,
    bio TEXT,
    updated_at TIMESTAMP,
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS chats  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type chat_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_details  (
    chat_id UUID PRIMARY KEY
        REFERENCES chats(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    picture TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_participants  (
    user_id UUID,
    chat_id UUID,
    role participant_role DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (user_id, chat_id)
);

CREATE TABLE IF NOT EXISTS messages  (
    id BIGSERIAL PRIMARY KEY,
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS users_blocked  (
    user_id UUID,
    blocked_user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (blocked_user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (user_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS users_chat_requests  (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID,
    receiver_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_request UNIQUE (sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS groups_chat_requests  (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID,
    chat_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES group_details(chat_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_group_request UNIQUE (sender_id, chat_id)
);

CREATE INDEX idx_messages_chat_id_created_at
ON messages(chat_id, created_at DESC);

CREATE INDEX idx_chat_participants_user_id
ON chat_participants(user_id);

CREATE INDEX idx_messages_sender_id
ON messages(sender_id);