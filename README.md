# SapbaShop

An inventory management web app designed for a Thai - International small
business.

![Screenshot of SapbaShop dashboard for desktop and mobile](../media/screenshots/dashboard.png)

## Features

- REST API
- Server Side Rendered Management User Interface
- Password Authentication
- Role based permissions management
- Management of Users, Stores, and Products
- Reports of product inventory levels
- Uses NoSQL to adapt to a growing business needs

# Requirements

To run the application you will need the following:

- MongoDB v5
- Nodejs v16 (LTS)

# Installation

## From Source

1. Download Source Code and dependencies
    ```sh
    git clone https://github.com/smithcli/SapbaShop.git
    cd Sapbashop
    npm install
    ```
2. Make configuration from sample.env file and edit .env
    ```sh
    cp sample.env .env
    ```
3. Run the app, (currently uses parcel cli to build frontend js)
    ```sh
    npm start
    ```

# Getting Started

Go to the server url, by default it will be http://localhost:8000 and login
using the default Administrator account

- email: admin@sapbashop.com
- password: pass1234

Then add your Store to be able to add products.

# Development set up

1. Follow installation instructions
2. Run the following scripts
    ```sh
    ./scripts/dev-podman-setup.sh
    ./script/genSelfSignCert.sh
    ```
3. Import test data
    ```javascript
    node script/import-dev-data.js --import
    ```
4. Use npm run dev or whichever required.

### Developer Notes:

This was my Capstone project for WGU. All requirements and supporting documents
can be found in the doc directory.
