import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Game.module.css";
import { formatTime } from "./utils/utils";
import { useGameTimer } from "./utils/useGameTimer.js";
import GameOver from "../components/GameOver.jsx";
import GameCharacters from "../components/GameCharacters.jsx";
import SelectGameCharacters from "../components/SelectGameCharacters.jsx";
import domainUrl from "../../domain.js";


function Game() {
  const [gameCharacters, setGameCharacters] = useState([]);
  const [clickedRelativePosition, setClickedRelativePosition] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [foundCharacter, setFoundCharacter] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [userscore, setUserscore] = useState(null);
  const [highscore, setHighscore] = useState(null);
  const { id } = useParams();
  const gameId = Number(id);
  const { time: seconds, startTimer, stopTimer, resetTimer } = useGameTimer();

  const gameImage = `/assets/images/game/${
    gameId === 1 ? "universe11.jpeg" : gameId === 2 ? "cyberpunkCity.webp" : ""
  }`;

  function loadGame(response) {
    setGameCharacters(response.gameCharacters);
    setFoundCharacters(response.foundCharacters);
    console.log(response);
    if ((response.newGame || response.existingGame) && !response.gameOver) {
      // Clear any previous interval to avoid multiple timers
      resetTimer();
      startTimer(response.gameStartTime);
    }
    if (response.newGame) {
      setGameOver(false);
    }

    if (response.gameOver) {
      setUserscore(response.userscore);
      setHighscore(response.highscore);
      setGameOver(true);
      stopTimer();
    }
  }
  //
  async function fetchGame() {
    fetch(`${domainUrl}/api/game/${gameId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((reponse) => {
            throw reponse.error;
          });
        }
        return response.json();
      })

      .then((response) => {
        loadGame(response);
      })
      .catch((err) => {
        console.log(err);
      }),
      [];
  }

  function handleClick(e) {
    const xClickPos = e.pageX;
    const yClickPos = e.pageY;
    const imageRect = e.currentTarget.getBoundingClientRect();
    // Offset with scroll height because image Top Position is relative to viewport
    // Subtract the imagePosititon in document from y and x click to adjust for any offset. (X and Y click is realtive to document)
    // divide with image height to get relative coordinates
    const relativeY =
      (yClickPos - imageRect.top - window.scrollY) / imageRect.height;
    const relativeX =
      (xClickPos - imageRect.left - window.scrollX) / imageRect.width;
    console.log(relativeX, relativeY);
    //setClickeeCoordinate([xPosition, yPosition]);
    setClickedRelativePosition([relativeX, relativeY]);
  }

  function handleCharacterSelect(e) {
    console.log("Selected");
    const characterId = e.currentTarget.dataset.id;
    fetch(`${domainUrl}/api/game/${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        position: clickedRelativePosition,
        characterId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            // Attach the parsed JSON error

            throw errorData.errors; // Throw the error with additional details
          });
        }
        return response.json();
      })
      .then((response) => {
        setClickedRelativePosition(null);
        console.log(response);
        const foundCharacter = response.foundCharacter;
        if (foundCharacter) {
          setFoundCharacters((prev) => [...prev, foundCharacter]);
          setFoundCharacter(foundCharacter.name);
          console.log(foundCharacter.name);
          setTimeout(() => {
            setFoundCharacter("");
          }, 1000);
        } else {
          console.log("No user Found");
        }
        if (response.foundCharacters.length === 3) {
          setGameOver(true);
          setUserscore(response.userscore);
          setHighscore(response.highscore);
          stopTimer();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function restartGame() {
    console.log(gameId);
    fetch(`${domainUrl}/api/restartGame/${gameId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => loadGame(response));
  }

  return (
    <>
      <div
        className={`${styles.container} ${
          gameId === 1 ? styles.universe11 : styles.cyberpunkCity
        }`}
      >
        <div className={styles.gameHeadingContainer}>
          <h1>Find this characters as fast as you can!</h1>
          <GameCharacters gameCharacters={gameCharacters} gameId={gameId} />

          <div className={styles.timer}>
            <p>{formatTime(seconds * 10)}</p>
          </div>
        </div>
        <div className={styles.gameContainer}>
          <img
            src={gameImage}
            alt=""
            className={styles.gameImage}
            onClick={(e) => handleClick(e)}
            onLoad={fetchGame}
          />

          {clickedRelativePosition && (
            <SelectGameCharacters
              handleCharacterSelect={handleCharacterSelect}
              gameId={gameId}
              gameCharacters={gameCharacters}
              clickedRelativePosition={clickedRelativePosition}
            />
          )}
          {foundCharacter && (
            <div className={styles.foundCharacter}>
              <p>You found {foundCharacter}</p>
            </div>
          )}
          {foundCharacters.length !== 0 &&
            foundCharacters.map((character) => (
              <div
                key={character.id}
                style={{
                  position: "absolute",
                  top: `${character.position.yBorder[0] * 100}%`,
                  left: `${character.position.xBorder[0] * 100}%`,
                  width: `${
                    (character.position.xBorder[1] -
                      character.position.xBorder[0]) *
                    100
                  }%`,
                  height: `${
                    (character.position.yBorder[1] -
                      character.position.yBorder[0]) *
                    100
                  }%`,
                }}
                className={styles.foundCharacters}
              ></div>
            ))}
        </div>
        {gameOver && (
          <GameOver
            userscore={userscore}
            setUserscore={setUserscore}
            highscore={highscore}
            restartGame={restartGame}
          />
        )}
      </div>
    </>
  );
}

export default Game;
