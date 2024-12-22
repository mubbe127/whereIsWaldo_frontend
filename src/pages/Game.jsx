import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Game.module.css";

function Game() {

  const [gameCharacters, setGameCharacters] = useState([]);
 
  const [clickedRelativePosition, setClickedRelativePosition] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [notifySuccess, setNotifySuccess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [userscore, setUserscore] = useState(null);
  const [highscore, setHighscore] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const { id } = useParams();
  const gameId = Number(id);
 
  
  const gameImage = `/assets/images/game/${gameId===1 ?  "universe11.jpeg" : gameId===2 ? "cyberpunkCity.webp" : ""}`

  async function fetchGame() {
    fetch(`http://localhost:4100/api/game/${gameId}`, {
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
      }),[]
  }

  function loadGame(response) {
  
    setGameCharacters(response.gameCharacters);
    setFoundCharacters(response.foundCharacters);
    console.log(response);
    if (response.newGame || response.existingGame) {
      // Clear any previous interval to avoid multiple timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      console.log("timer");

      // Start a new timer or resume based on the backend response
      const elapsedTime = Date.now() - response.gameStartTime || 0;
      console.log(elapsedTime); // Use backend-provided elapsed time
      setSeconds(elapsedTime / 10); // Start from where the game left off

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 10);
      }, 100);
    }
    if (response.newGame) {
      setGameOver(false);
    }

    if (response.gameOver) {
      setUserscore(response.userscore);
      setHighscore(response.highscore);
      setGameOver(true);
      clearInterval(timerRef.current);
    }

  }
  const formatTime = (totalMilliseconds) => {
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = totalMilliseconds % 1000;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}:${String(milliseconds).padStart(3, "0")}`;
  };

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
    console.log(relativeX, relativeY)
    //setClickeeCoordinate([xPosition, yPosition]);
    setClickedRelativePosition([relativeX, relativeY]);
  }

  function handleCharSelect(e) {
    const characterId = e.currentTarget.dataset.id;
    fetch(`http://localhost:4100/api/game/${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add your API key to the headers
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
          setNotifySuccess(foundCharacter.name);
          console.log(foundCharacter.name);
          setTimeout(() => {
            setNotifySuccess("");
          }, 1000);
        } else {
          console.log("No user Found");
        }
        if (response.foundCharacters.length === 3) {
          setGameOver(true);
          setUserscore(response.userscore);
          setHighscore(response.highscore);
          if (timerRef.current) {
            console.log("clearing new game interval");
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function submitUsername(e) {
    e.preventDefault();
    fetch(`http://localhost:4100/api/game/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add your API key to the headers
      },
      credentials: "include",
      body: JSON.stringify({
        username: usernameInput,
        id: userscore.id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setUserscore((prev) => ({
          ...prev, // Spread the previous state
          username: usernameInput, // Update the `username` property
        }));
        setUsernameInput("");
        console.log("jiep");
      });
  }
  function newGame() {
    fetch(`http://localhost:4100/api/restartGame/${gameId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => loadGame(response));
  }
  function resetGame() {
    return;
  }

  function endGame() {
    setGameOver(true);
  }

  return (
    <>
    <div className={ `${styles.container} ${gameId ===1 ? styles.universe11 : styles.cyberpunkCity}` }>
        <div className={styles.gameHeadingContainer}>
          <h1>Find this characters as fast as you can!</h1>
          <div className={styles.charactersContainer}>
            {gameCharacters.map((character) => (
              <div key={character.id} className={styles.characterContainer}>
                <div
                  onClick={(e) => handleCharSelect(e)}
                  data-id={character.id}
                  className={styles.characterImageContainer}
                >
                  <img
                    src={
                         "/assets/images/characters/" + `${gameId===1 ? "universe11/" : gameId===2 ? "cyberpunkCity/" : ""}` + character.id + ".png"
                    }
                    alt=""
                    className={styles.characterImage}
                  />
                </div>
                <p>{character.name}</p>
              </div>
            ))}
          </div>
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
                  onClick={(e) => handleCharSelect(e)}
                  data-id={character.id}
                >
                  <div
                  
                    className={styles.selectCharacterImageContainer}
                  >
                    <img
                      src={
                       "/assets/images/characters/" + `${gameId===1 ? "universe11/" : gameId===2 ? "cyberpunkCity/" : ""}` + character.id + ".png"
                      }
                      alt=""
                      className={styles.SelectCharacterImage}
                    />
                  </div>
                  <p>{character.name}</p>
                </div>
              ))}
            </div>
          )}
          {notifySuccess && (
            <div className={styles.notifySuccess}>
              <p>You found {notifySuccess}</p>
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
          <div className={styles.gameOverBackground}>
            <div className={styles.gameOverContainer}>
              <h1 className={styles.gameOverHeading}>Game over</h1>

              {userscore && userscore.rank && (
                <>
                  <div className={styles.userscoreContainer}>
                    <p>You found all champs in {userscore.gameTime} s</p>
                    <p>
                      Well done! You're now {userscore.rank} on the high score
                      table!
                    </p>
                  </div>
                </>
              )}

              {userscore && !userscore.rank && (
                <div className={styles.userscoreContainer}>
                  <p>You found all champs in {userscore.gameTime} s</p>
                  <p>
                    You didn’t make the leaderboard this time, but don’t give
                    up!
                  </p>
                </div>
              )}
              <div className={styles.highscoreContainer}>
                <h1 className={styles.highscoreHeading}>Highscore</h1>
                <div className={styles.scoreContainerHeading}>
                  <div className={styles.rank}>
                    <p>Rank</p>
                  </div>
                  <div className={styles.username}>
                    <p>Username</p>
                  </div>
                  <div>
                    <p>TIME</p>
                  </div>
                </div>
                {highscore.map((score, index) => (
                  <div key={score.id} className={styles.scoreContainer}>
                    <div className={styles.rank}>
                      <p>{index + 1}.</p>
                    </div>
                    {userscore.rank &&
                    userscore.rank === index + 1 &&
                    userscore.username === "Anonymous" ? (
                      <div className={styles.usernameInput}>
                        <form action="" onSubmit={(e) => submitUsername(e)}>
                          <input
                            onChange={(e) => setUsernameInput(e.target.value)}
                            value={usernameInput}
                          />
                        </form>
                      </div>
                    ) : userscore.rank === index + 1 &&
                      userscore.username !== "Anonymous" ? (
                      <div className={styles.username}>
                        <p>{userscore.username}</p>
                      </div>
                    ) : (
                      <div className={styles.username}>
                        <p>{score.username}</p>
                      </div>
                    )}

                    <div>
                      <p>{score.gameTime}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={newGame}
                className={styles.newGameButton}
              >
                Start new game
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Game;
