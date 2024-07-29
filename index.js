const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const bodyParser = require('body-parser');
const config = require('./config.json');
const cors = require('cors');
const app = express();
const pool = new Pool(config.db);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Helper function to convert amenities string to PostgreSQL array literal
const formatArray = (value) => {
    return `{${value.split(',').map(item => item.trim()).join(',')}}`;
};

// Routes
app.post('/add-hotel', upload.fields([{ name: 'images' }, { name: 'host_image' }]), async (req, res) => {
    const {
        slug,
        title,
        description,
        guest_count,
        bedroom_count,
        bathroom_count,
        amenities,
        host_name,
        host_category,
        hosting_experience,
        address,
        latitude,
        longitude
    } = req.body;

    const images = req.files['images'] ? req.files['images'].map(file => '/uploads/' + file.filename) : [];
    const host_image = req.files['host_image'] ? '/uploads/' + req.files['host_image'][0].filename : null;

    try {
        const client = await pool.connect();
        await client.query(
            `INSERT INTO hotels (
                slug, images, title, description, guest_count, bedroom_count, bathroom_count,
                amenities, host_image, host_name, host_category, hosting_experience, address, latitude, longitude
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
                slug,
                images,
                title,
                description,
                guest_count === '' ? null : parseInt(guest_count, 10),
                bedroom_count === '' ? null : parseInt(bedroom_count, 10),
                bathroom_count === '' ? null : parseInt(bathroom_count, 10),
                formatArray(amenities),
                host_image,
                host_name,
                host_category,
                hosting_experience === '' ? null : parseInt(hosting_experience, 10),
                address,
                latitude === '' ? null : parseFloat(latitude),
                longitude === '' ? null : parseFloat(longitude)
            ]
        );
        client.release();
        res.status(201).json({ message: 'Hotel added successfully' });
    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get-hotel/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM hotels WHERE slug = $1`,
            [slug]
        );
        client.release();

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Hotel not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error('Error retrieving data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
