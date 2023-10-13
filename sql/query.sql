DROP TABLE IF EXISTS ufos;
CREATE TABLE ufos (
    id SERIAL PRIMARY KEY,
    datetime DATETIME NOT NULL,
    city VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    shape VARCHAR NOT NULL,
    duration_secs INT NOT NULL,
    duration_min VARCHAR,
    date_posted DATETIME,
    latitude NUMERIC,
    longtiude NUMERIC
);

COPY ufos TO 'C:\Users\andre\Documents\GitHub\project-3\data\scrubbed.csv' DELIMITER ',' CSV HEADER;