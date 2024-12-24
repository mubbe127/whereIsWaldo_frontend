import { useEffect, useState, useRef } from "react";
import styles from "./GameCharacters.module.css"

function GameCharacters({ gameCharacters, gameId }) {



  return (
    <div className={styles.charactersContainer}>
      {gameCharacters.map((character) => (
        <div key={character.id} className={styles.characterContainer}>
          <div
            data-id={character.id}
            className={styles.characterImageContainer}
          >
            <img
              src={
                "/assets/images/characters/" +
                `${
                  gameId === 1
                    ? "universe11/"
                    : gameId === 2
                    ? "cyberpunkCity/"
                    : ""
                }` +
                character.id +
                ".png"
              }
              alt=""
              className={styles.characterImage}
            />
          </div>
          <p>{character.name}</p>
        </div>
      ))}
    </div>
  );
}


export default GameCharacters