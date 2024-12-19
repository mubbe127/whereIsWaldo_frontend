import { useEffect, useState } from "react";
import styles from "./Game.module.css";
import gameImage from "../assets/images/universe11.jpeg";

function Game() {
  const [gameCharacters, setGameCharacters]= useState([])
  const [clickedRelativePosition, setClickedRelativePosition] = useState(null);
  const [foundCharacters, setFoundChararacters] = useState(null);

  
 

  function handleClick(e) {
    const xClickPos = e.pageX;
    const yClickPos = e.pageY;
    const imageRect = e.currentTarget.getBoundingClientRect();
    const imageTopPos = Math.abs(imageRect.top); // relative to viewport so might return negative value
    const imageLeftPos = Math.abs(imageRect.left); // relative to viewport so might return negative value

    // Offset with scroll height because image Top Position is relative to viewport
    // Subtract the imagePosititon in document from y and x click to adjust for any offset. (X and Y click is realtive to document)
    // divide with image height to get relative coordinates
    const relativeY =
      (yClickPos - imageTopPos + window.scrollY) / imageRect.height;
    const relativeX =
      (xClickPos - imageLeftPos + window.scrollX) / imageRect.width;

    console.log(relativeX, relativeY);

    //setClickeeCoordinate([xPosition, yPosition]);
    setClickedRelativePosition([relativeX, relativeY]);
  }

  function handleCharSelect(e) {
    const characterId = e.currentTarget.dataset.id;
    fetch(`http://localhost:4100/api/game/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add your API key to the headers
      },
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

        setFoundChararacters((prev) => [
          ...prev,
          {
            position: response.position,
            name: response.name,
            id: response.id,
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.gameContainer}>
          <div className={styles.imageContainer}>
            <img
              src={gameImage}
              alt=""
              className={styles.gameImage}
              onClick={(e) => handleClick(e)}
            />

            {clickedRelativePosition && (
              <div
                className={styles.charContainer}
                style={{
                  position: "absolute",
                  left: `${clickedRelativePosition[0] * 100}%`,
                  top: `${clickedRelativePosition[1] * 100}%`,
                }}
              >
                <div onClick={(e) => handleCharSelect(e)} data-id="1">
                  <img src="" alt="" />
                  hej
                </div>
                <div onClick={(e) => handleCharSelect(e)} data-id="2">
                  <img src="" alt="" />
                  då
                </div>
                <div onClick={(e) => handleCharSelect(e)} data-id="3">
                  <img src="" alt="" />
                  få
                </div>
              </div>
            )}
            {foundCharacters &&
              foundCharacters.map((character) => (
                <div
                  key={character.id}
                  style={{
                    position: "absolute",
                    top: `${character.position.yBorder[0]}`,
                    bottom: `${character.position.yBorder[1]}`,
                    left: `${character.position.xBorder[0]}`,
                    right: `${character.position.xBorder[1]}`,
                  }}
                  className={styles.foundCharacters}
                ></div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
