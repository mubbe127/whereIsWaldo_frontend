
import { useEffect, useState, useRef } from "react";
import styles from "./GameOver.module.css"
import domainUrl from "../../domain";

function GameOver({userscore, setUserscore, highscore, restartGame}){

  const [usernameInput, setUsernameInput] = useState("");

    function submitUsername(e) {
        e.preventDefault();
        console.log("submit username");
        fetch(`${domainUrl}/api/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          })
          .catch((error) => console.log(error));
      }



    return (


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
            onClick={restartGame}
            className={styles.newGameButton}
          >
            Start new game
          </button>
        </div>
      </div>
    )
}

export default GameOver