import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import "firebase/database";
import "firebase/firebase-storage";
import "firebase/auth";
import "./App.css";

function RoomGame(props) {
  const [localClicks, setLocalClicks] = useState(0);
  const [visitorClicks, setVisitorClicks] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isLocal, setIsLocal] = useState(true);
  const [idGame, setIdGame] = useState();
  const [start, setStart] = useState(false);
  const [timeToStart, setTimeToStart] = useState(3);
  const [startCountdown, setStartCountdown] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [visitorUser, setVisitorUser] = useState(null);
  const history = useHistory();

  //useEffect for update database when visitor or local leaves.
  useEffect(() => {
    let id = sessionStorage.getItem("actualIDGame");
    let user = sessionStorage.getItem("user");
    let userOwner = sessionStorage.getItem("actualOwner");
    if (user === userOwner) {
      window.onbeforeunload = confirmExit;
      function confirmExit() {
        firebase.database().ref(`games/${id}`).remove();
      }
    } else {
      window.onbeforeunload = confirmExit;
      function confirmExit() {
        firebase.database().ref(`games/${id}`).update({ visitorUser: null });
      }
    }
  }, []);

  useEffect(() => {
    let id = sessionStorage.getItem("actualIDGame");
    let user = sessionStorage.getItem("user");
    let userOwner = sessionStorage.getItem("actualOwner");
    if (user === userOwner) {
      return () => {
        firebase.database().ref(`games/${id}`).remove();
      };
    } else {
      return () => {
        firebase.database().ref(`games/${id}`).update({ visitorUser: null });
      };
    }
  }, []);

  //useEffect for update all data in state
  useEffect(() => {
    let actualUser = sessionStorage.getItem("user");
    let id = window.location.pathname.slice(1);
    setIdGame(id);
    sessionStorage.setItem("actualIDGame", id);
    let db = firebase.database();
    db.ref(`games/${id}/`).on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setVisitorClicks(snapshot.val().visitor);
        setLocalClicks(snapshot.val().local);
        setTimer(snapshot.val().timer);
        setTimeToStart(snapshot.val().timeStart);
        setStart(snapshot.val().currentGame);
        if (snapshot.val().gameStart) {
          setStartCountdown(true);
        } else {
          setStartCountdown(false);
        }
        setLocalUser(snapshot.val().localUser);
        setVisitorUser(snapshot.val().visitorUser);
        if (snapshot.val().localUser === actualUser) {
          setIsLocal(true);
        } else {
          setIsLocal(false);
        }
      } else {
        history.push("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //useEffect for update timer in state and show result
  useEffect(() => {
    if (start) {
      if (!timer) {
        firebase.database().ref(`games/${idGame}`).update({ timer: null });
        let container = document.getElementById("result");
        if (isLocal) {
          if (localClicks > visitorClicks) {
            container.innerHTML = "You win";
          } else if (localClicks < visitorClicks) {
            container.innerHTML = "You lose";
          } else {
            container.innerHTML = "Draw";
          }
        } else {
          if (localClicks < visitorClicks) {
            container.innerHTML = "You win";
          } else if (localClicks > visitorClicks) {
            container.innerHTML = "You lose";
          } else {
            container.innerHTML = "Draw";
          }
        }
        return;
      }

      const intervalId = setInterval(() => {
        firebase
          .database()
          .ref(`games/${idGame}`)
          .update({ timer: timer - 1 });
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (startCountdown) {
      if (!timeToStart) {
        firebase
          .database()
          .ref(`games/${idGame}`)
          .update({ gameStart: false, timeStart: null, currentGame: true });
        return;
      }

      const intervalIdStart = setInterval(() => {
        firebase
          .database()
          .ref(`games/${idGame}`)
          .update({ timeStart: timeToStart - 1 });
      }, 1000);
      return () => clearInterval(intervalIdStart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, start, timeToStart, startCountdown]);

  //function for update clicks
  const handleClick = () => {
    if (isLocal) {
      firebase
        .database()
        .ref(`games/${idGame}`)
        .update({ local: localClicks + 1 });
    } else {
      firebase
        .database()
        .ref(`games/${idGame}`)
        .update({ visitor: visitorClicks + 1 });
    }
  };

  //function for start game
  const handleStart = () => {
    firebase.database().ref(`games/${idGame}`).update({ gameStart: true });
  };

  //function for reset all data
  const handleReset = () => {
    firebase.database().ref(`games/${idGame}`).update({
      timer: 10,
      local: 0,
      visitor: 0,
      gameStart: false,
      timeStart: 3,
      currentGame: false,
    });
  };

  return (
    <div className="container">
      <main className="main">
        <p onClick={() => history.push("/")}>Go back</p>
        <h1>Click battle</h1>
        {timer > 0 ? (
          <>
            <div className="row mb-5 w-100">
              <div className="col-6 text-center">
                <h4>
                  Opponent has <br />
                  {isLocal ? visitorClicks : localClicks} clicks!
                </h4>
                <button
                  disabled={!start}
                  id="visitorButton"
                  className="btn-click"
                >
                  Click
                </button>
                <p className="mt-3">
                  {!isLocal
                    ? localUser
                    : !!visitorUser
                    ? visitorUser
                    : "Waiting for an opponent..."}
                </p>
              </div>
              <div className="col-6 text-center">
                <h4>
                  You have <br /> {isLocal ? localClicks : visitorClicks}{" "}
                  clicks!
                </h4>
                <button
                  className="btn-click"
                  disabled={!start}
                  onClick={handleClick}
                >
                  Click
                </button>
                <p className="mt-3">{isLocal ? localUser : visitorUser}</p>
              </div>
            </div>
            {isLocal ? (
              <button
                className="btn-click mb-5"
                disabled={!start && !!!visitorUser}
                onClick={() => handleStart()}
              >
                Start!
              </button>
            ) : (
              (!startCountdown || !start) && <h4>Waiting for host...</h4>
            )}
          </>
        ) : (
          <div id="resultContainer" className=" text-center mb-2">
            <h1 id="result">Result</h1>
            <h2>
              {isLocal ? visitorUser : localUser} clicks:{" "}
              {isLocal ? visitorClicks : localClicks} - Your clicks:{" "}
              {isLocal ? localClicks : visitorClicks}
            </h2>
            {isLocal && (
              <button className="btn-click mb-4" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        )}
        {timer !== undefined && (
          <h2 className="text-center">{timer} seconds remaining!</h2>
        )}
        <p>You are {isLocal ? "Local" : "Visitor"}</p>
      </main>
      {startCountdown && timeToStart >= 0 && (
        <div className="start-countdown">
          {timeToStart === 0 ? "Go" : timeToStart}
        </div>
      )}
      <div className="start-countdown">
        {timeToStart === 0 ? "Go" : timeToStart}
      </div>
    </div>
  );
}

export default RoomGame;
