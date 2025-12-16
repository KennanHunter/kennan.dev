-- Migration number: 0001 	 2025-12-16T06:04:02.922Z

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photo_versions (
    id SERIAL PRIMARY KEY,
    photo_id INTEGER REFERENCES photos (id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL
);

CREATE TABLE photo_version_blur (
    photo_version_id INTEGER PRIMARY KEY,
    blur_data TEXT NOT NULL,
    FOREIGN KEY (photo_version_id) REFERENCES photo_versions (id) ON DELETE CASCADE
);

CREATE INDEX idx_photo_versions_photo_id ON photo_versions (photo_id);

CREATE TABLE photo_collection (
    name TEXT PRIMARY KEY,
    description TEXT,
    created_at INTEGER NOT NULL,
    created_by TEXT
);

CREATE TABLE photo_collection_photos (
    photo_collection_name TEXT REFERENCES photo_collection (name) ON DELETE CASCADE,
    photo_id INTEGER REFERENCES photos (id) ON DELETE CASCADE,
    PRIMARY KEY (
        photo_collection_name,
        photo_id
    )
);