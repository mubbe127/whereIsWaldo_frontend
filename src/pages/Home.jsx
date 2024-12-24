import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
function Home() {



  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}></div>
      <div className={styles.heading}>
        <h1>FIND THE HIDDEN CHARACTERS AS FAST AS POSSIBLE</h1>
      </div>
      <div className={styles.gamesContainer}>
        <Link to="/game/1">
          <div className={`${styles.gameContainer} ${styles.universe11}`}>
            <h3>Universe 11</h3>
            <img src="./src/assets/images/game/robotCity.webp" alt="" />
            <div className={styles.charactersContainer}>
              <div>
                <img
                  src="/assets/images/characters/universe11/0.png"
                  alt=""
                />
                <h5>Gandald</h5>
              </div>
              <div>
                <img
                  src="/assets/images/characters/universe11/1.png"
                  alt=""
                />
                <h5>Luffy</h5>
              </div>
              <div>
                <img
                  src="/assets/images/characters/universe11/2.png"
                  alt=""
                />
                <h5>Harry Potter</h5>
              </div>
            </div>
            
          </div>
          
        </Link>
        <Link to="/game/2">
          <div className={`${styles.gameContainer} ${styles.cyberpunkCity}`}>
            <h3>Cyberpunk City</h3>
            <img src="./src/assets/images/game/cyberpunkCity.webp" alt="" />
            <div className={styles.charactersContainer}>
              <div>
                <img
                  src="/assets/images/characters/cyberpunkCity/0.png"
                  alt=""
                />
                <h5>Patric</h5>
              </div>
              <div>
                <img
                  src="/assets/images/characters/cyberpunkCity/1.png"
                  alt=""
                />
                <h5>Super Mario</h5>
              </div>
              <div>
                <img
                  src="/assets/images/characters/cyberpunkCity/2.png"
                  alt=""
                />
                <h5>Phineas</h5>
              </div>
            </div>
          </div>
        </Link>
        <div className={`${styles.gameContainer} ${styles.deadZone}`}>
          <h3>Dead zone</h3>
          <img src="./src/assets/images/game/deadZone.jpg" alt="" />
          <div className={styles.charactersContainer}></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
