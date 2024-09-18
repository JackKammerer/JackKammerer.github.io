## Getting Started

To use this project, there are three steps:

1. Install Docker and/or Docker Desktop.

2. Setup a .env file in the directory. This file should have the following schema:

```bash
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB

DATABASE_URL
SERVER_URL

API_GITHUB_KEY

APP_USERNAME
APP_PASSWORD

ADMIN_ACCOUNT_USERNAME
ADMIN_ACCOUNT_PASSWORD

```
These define several aspects of the database. There are some rules outlined before for what these strings should be to allow the site to work properly.

3. Run the server using Docker Compose: *docker compose up -d*.

Now, the server is running with the database. I will add more documentation to the future and outline some features, but this a relatively flexible and cohesive website. Powered by Rust, Axum, and Askama on the server side, and Javascript, Typescript, Tailwind, and Vite on the client side. Those repositories will be saved and linked soon.


## Attributions:

#### All of the models used in this site (as seen on the website) are not my own. Here are the attributions for all of the models used in the site. They were downloaded for free on Sketchfab. All of these models have been modified and converted into .glb files, but the originals are still stored in this repository, and credited below. 

IBM PCjr 4863 Computer-Freepoly.org from Freepoly.org at https://sketchfab.com/3d-models/ibm-pcjr-4863-computer-freepolyorg-1c3c3cd0643d44d49a1771048da74c62

Oculus Quest VR Headset from BlackCube at https://sketchfab.com/3d-models/oculus-quest-vr-headset-0d6c1d6aa3f747a5b35f8105ed585418

Calculator from Powerbyte7 at https://sketchfab.com/3d-models/calculator-d9ffbc4bbe1044bb902e1dddac52b0de 

Pencil from Shedmon at https://sketchfab.com/3d-models/pencil-9e0dba29de734ac4b20060ec873dc36c 

Some eraser two from Artieee at https://sketchfab.com/3d-models/some-eraser-two-0bdd6e5a1a0845759357b5564e588f5c 

Notebook from Alain Sorazu at https://sketchfab.com/3d-models/notebook-b0ee64ec4a504764ab07eb93a1076feb

Controller from cosmicollie at https://sketchfab.com/3d-models/controller-5ba4ef24d6554dc9b34417f41b7b0191

Desktop Computer from Tytan at https://sketchfab.com/3d-models/desktop-computer-561abc2fc95941609fc7bc6f232895c2

Monitor from portgl16 at https://sketchfab.com/3d-models/monitor-9f6f9018f14a4dbea1ad1aea0ce89e7c

Office Chair from Red Fox / nokillando at https://sketchfab.com/3d-models/office-chair-b228a29fa84544c2be501c295653ffe7

Computer Desk from felixawani at https://sketchfab.com/3d-models/computer-desk-05353724b7884bfb81211c7033a57fd4