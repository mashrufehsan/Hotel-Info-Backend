const { Pool } = require('pg');
const config = require('./config.json');

const pool = new Pool(config.db);

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS hotels (
            slug VARCHAR(255) PRIMARY KEY,
            images TEXT[],
            title VARCHAR(255) NOT NULL,
            description TEXT,
            guest_count INTEGER,
            bedroom_count INTEGER,
            bathroom_count INTEGER,
            amenities TEXT[],
            host_image TEXT,
            host_name VARCHAR(255),
            host_category VARCHAR(255),
            hosting_experience INTEGER,
            address TEXT,
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION
        );

        CREATE TABLE IF NOT EXISTS rooms (
            room_slug VARCHAR(255),
            hotel_slug VARCHAR(255) REFERENCES hotels(slug) ON DELETE CASCADE,
            room_image TEXT,
            room_title VARCHAR(255) NOT NULL,
            bedroom_count INTEGER
        );
        `);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables', err);
    } finally {
        client.release();
    }
};

createTables();
