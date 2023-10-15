DROP TABLE IF EXISTS ufos;
CREATE TABLE ufos (
    id SERIAL PRIMARY KEY,
    datetime DATE NOT NULL,
    city VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    shape VARCHAR NOT NULL,
    duration_seconds INT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    date_posted DATE
);

COPY ufos TO 'C:\Users\andre\Documents\GitHub\project-3\data\scrubbed.csv' DELIMITER ',' CSV HEADER;