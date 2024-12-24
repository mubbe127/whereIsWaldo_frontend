import { useEffect, useState, useRef } from "react";
import styles from "./SelectGameCharacters.module.css";

function SelectGameCharacters({
  gameCharacters,
  gameId,
  clickedRelativePosition,
  handleCharacterSelect,
}) {
  return (
    <div
      className={styles.selectCharactersContainer}
      style={{
        position: "absolute",

        left:
          clickedRelativePosition[0] < 0.7
            ? `${clickedRelativePosition[0] * 100}%`
            : undefined,
        right:
          clickedRelativePosition[0] >= 0.7
            ? `${(1 - clickedRelativePosition[0]) * 100}%`
            : undefined,
        top:
          clickedRelativePosition[1] < 0.7
            ? `${clickedRelativePosition[1] * 100}%`
            : undefined,
        bottom:
          clickedRelativePosition[1] >= 0.7
            ? `${(1 - clickedRelativePosition[1]) * 100}%`
            : undefined,
      }}
    >
      {gameCharacters.map((character) => (
        <div
          key={character.id}
          className={styles.selectCharacterContainer}
          onClick={(e) => handleCharacterSelect(e)}
          data-id={character.id}
        >
          <div className={styles.selectCharacterImageContainer}>
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
              className={styles.SelectCharacterImage}
            />
          </div>
          <p>{character.name}</p>
        </div>
      ))}
    </div>
  );
}

export default SelectGameCharacters;
