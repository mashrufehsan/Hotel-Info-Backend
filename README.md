# Hotel Details Backend

This repository contains the backend of the Hotel Details application. The backend is built using Node.js and Express.js and serves hotel details from a PostgreSQL database.

## Features
- Serves hotel details including slug, images, title, description, guest count, bedroom count, bathroom count, amenities, host information, address, latitude, longitude, and room information.
- Handles exceptions properly to ensure the app does not crash.
- Handles status codes with proper response/error messages.
- Uses a configuration JSON file for credentials (e.g., DB access).

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Configuration JSON file for credentials


## Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/mashrufehsan/Hotel-Info-Backend
    ```
2. Navigate to the project directory:
    ```bash
    cd Hotel-Info-Backend
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up the PostgreSQL database and update `config/db.json` with your database credentials:
    ```json
    {
        "user": "your-db-username",
        "host": "your-db-host",
        "database": "your-db-name",
        "password": "your-db-password",
        "port": "your-db-port"
    }
    ```
5. Start the server:
    ```bash
    npm start
    ```
6. The API will be available at [http://localhost:4000](http://localhost:4000).

## API Endpoints
- `GET /get-hotel/:slug` - Get details of a hotel by slug.
- `POST /add-hotel` - Insert Hotel details into the database.
- `GET /get-room` - Get the hotel room details by slug.
- `POST /add-room` - Insert room details into the database.
- More endpoints can be added as needed.

## Database Schema
- hotels Table:
  - Slug
  - Images
  - Title
  - Description
  - Guest count
  - Bedroom count
  - Bathroom count
  - Amenities
  - Host image
  - Host name
  - Host category
  - Hosting experience
  - Address
  - Latitude
  - Longitude
  - Rooms Table:
- rooms Table
  - Room slug
  - Hotel slug
  - Room image
  - Room title
  - Bedroom count
