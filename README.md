  <p align="center">
  <br />
    <br/>
    <br/>
    <a href="https://henek123.github.io/dnd-spell-list/"><strong>Explore the website</strong></a>
    <br />
    
  </p>
</div>

<!-- ABOUT THE PROJEC -->
## About The Project

dnd-spell-list is a website made in React. Spell list is fetched with the help of GraphQL and Apollo Client from D&D 5e API. 
* When the page is opened, it shows a loading screen until all spells are loaded.
* After first download spells are stored in cache memory.
* Each spell has own extentable card.
* User can show saved spells by clicking button.
* User can create account to save spells to Firestore.
* After login in list of previously saved spells is loaded from Firestore.
* User can use buttons at the top of the webiste to filter throught spells.
* User can search for spell by it's name.
* Any combination of Paladin class and level 6, 7, 8, 9 and cantrips filters is disabled because he has no spells higher than level 5 and cantrips.
* Due to low possibility of data updating in API response is chaced in local storage with the expiration date of 1 month.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Used Technologies

* JavaScript
* HTML
* CSS
* React
* GraphQl
* D&D 5e API
* Apollo Client
* Firebase Authentication
* Firebase Firestore

## Desktop view
<img src="./src/img/readme/desktop1.png" alt="Logo" width="100%" height="100%">
<img src="./src/img/readme/desktop2.png" alt="Logo" width="100%" height="100%">
<img src="./src/img/readme/desktop3.png" alt="Logo" width="100%" height="100%">

## Mobile view
<img src="./src/img/readme/mobile1.jpg" alt="Logo" width="30%" height="auto"> <img src="./src/img/readme/mobile3.jpg" alt="Logo" width="30%" height="auto"> <img src="./src/img/readme/mobile2.jpg" alt="Logo" width="30%" height="auto">      


<!-- CONTACT -->
## Contact

Artur Bieniek
* e-mail: artur9724@gmail.com
* linkedIn: https://www.linkedin.com/in/artur-bieniek-8406a9245/

Project Link: [https://henek123.github.io/dnd-spell-list/](https://henek123.github.io/dnd-character-sheet/)
