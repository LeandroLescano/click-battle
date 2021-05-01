import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import "firebase/database";
import "firebase/firebase-storage";
import "firebase/auth";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

function RoomGame(props) {
  const [isLocal, setIsLocal] = useState(false);
  const [idGame, setIdGame] = useState();
  const [roomName, setRoomName] = useState();
  const [maxUsers, setMaxUsers] = useState(2);
  const [start, setStart] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [visitorUser, setVisitorUser] = useState({ username: "" });
  const [listUsers, setListUsers] = useState([
    { username: "", clicks: 0, rol: "visitor" },
  ]);
  const [userGameKey, setUserGameKey] = useState("");
  const [timer, setTimer] = useState(10);
  const [timeToStart, setTimeToStart] = useState(3);

  const history = useHistory();

  //useEffects for update database when visitor or local leaves.
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
    let idGame = sessionStorage.getItem("actualIDGame");
    let user = sessionStorage.getItem("user");
    let userOwner = sessionStorage.getItem("actualOwner");
    let userGameKeyLocal = sessionStorage.getItem("gameUserKey");
    if (user === userOwner) {
      return () => {
        firebase.database().ref(`games/${idGame}`).remove();
      };
    } else {
      return () => {
        firebase
          .database()
          .ref(`games/${idGame}/listUsers/${userGameKeyLocal}`)
          .remove();
      };
    }
  }, []);

  //useEffect for update all data in state
  useEffect(() => {
    let actualUser = sessionStorage.getItem("user");
    let id = window.location.pathname.slice(1);
    let userGameKeyLocal = sessionStorage.getItem("gameUserKey");
    setUserGameKey(userGameKeyLocal);
    setIdGame(id);
    sessionStorage.setItem("actualIDGame", id);
    let db = firebase.database();
    db.ref(`games/${id}/`).on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setRoomName(snapshot.val().roomName);
        setTimer(snapshot.val().timer);
        setTimeToStart(snapshot.val().timeStart);
        setStart(snapshot.val().currentGame);
        setMaxUsers(snapshot.val().maxUsers);
        if (snapshot.val().gameStart) {
          setStartCountdown(true);
        } else {
          setStartCountdown(false);
        }
        let listUsers = [];
        Object.entries(snapshot.val().listUsers).forEach((val) => {
          let objUser = {
            username: val[1].username,
            clicks: val[1].clicks,
            rol: val[1].rol,
            maxScore: val[1].maxScore,
            key: val[0],
          };
          if (val[0] === userGameKeyLocal) {
            setVisitorUser(objUser);
          }
          listUsers.push(objUser);
        });
        setListUsers(listUsers);
        if (snapshot.val().ownerUser.username === actualUser) {
          setIsLocal(true);
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
        let userKey = sessionStorage.getItem("userKey");
        if (userKey) {
          if (visitorUser.clicks > visitorUser.maxScore) {
            firebase
              .database()
              .ref(`users/${userKey}`)
              .update({ maxScore: visitorUser.clicks });
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
    firebase
      .database()
      .ref(`games/${idGame}/listUsers/${userGameKey}`)
      .update({ clicks: visitorUser.clicks + 1 });
  };

  //function for start game
  const handleStart = () => {
    firebase.database().ref(`games/${idGame}`).update({ gameStart: true });
  };

  //function for reset all data
  const handleReset = () => {
    firebase.database().ref(`games/${idGame}`).update({
      timer: 10,
      gameStart: false,
      timeStart: 3,
      currentGame: false,
    });
    firebase
      .database()
      .ref(`games/${idGame}/listUsers`)
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          child.ref.update({ clicks: 0 });
        });
      });
  };

  return (
    <>
      {startCountdown && timeToStart >= 0 && (
        <div className="start-countdown">
          {timeToStart === 0 ? "Go" : timeToStart}
        </div>
      )}
      <div className="container-fluid">
        <main className="main">
          <div className="room-name position-absolute d-none d-md-block">
            {roomName}
          </div>
          <div className="header py-4 flex-lg-row">
            <button
              className="btn-click p-2 btn-back me-auto mb-4"
              onClick={() => history.push("/")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mx-1" /> Go back
            </button>
            <span className="d-block d-md-none m-auto">{roomName}</span>
            <h1 className="me-auto d-none d-md-block position-absolute">
              Click battle
            </h1>
          </div>
          {timer > 0 ? (
            <>
              <div className="row mb-3 w-100 g-4">
                <div className="col-md-6 text-center opponents-container">
                  {listUsers.length > 1 ? (
                    <div className="row row-users-title">
                      <div className="col-8 text-start">
                        <p className="mb-2">
                          Opponents ({listUsers.length - 1}/{maxUsers - 1})
                        </p>
                      </div>
                      <div className="col-4 pe-4">Clicks</div>
                    </div>
                  ) : (
                    <h4>Waiting for opponents...</h4>
                  )}
                  {listUsers
                    .filter((user) => user.key !== visitorUser.key)
                    .sort((a, b) => b.clicks - a.clicks)
                    .map((user, i) => {
                      return (
                        <div className="visitor-container" key={i}>
                          <div className="row row-user">
                            <div className="col-8 text-start">
                              {user.username}
                            </div>
                            <div className="col-4">{user.clicks}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="col-md-6 text-center">
                  <h4>You have {visitorUser.clicks} clicks!</h4>
                  <div className="d-flex justify-content-around">
                    <button
                      className="btn-click my-2"
                      disabled={!start}
                      onClick={handleClick}
                    >
                      Click
                    </button>
                    {isLocal && !start && !startCountdown && (
                      <button
                        className="btn-click my-2"
                        disabled={!start && listUsers.length < 2}
                        onClick={() => handleStart()}
                      >
                        Start!
                      </button>
                    )}
                  </div>
                  <p className="mt-3 mb-0">{visitorUser.username}</p>
                </div>
              </div>
              {!isLocal && !startCountdown && !start && (
                <h4>Waiting for host...</h4>
              )}
            </>
          ) : (
            <div
              id="result-container"
              className="result-container text-center mb-2"
            >
              <h1 id="result" className="no-select">
                Result
              </h1>
              {listUsers
                .sort((a, b) => (a.clicks < b.clicks ? 1 : -1))
                .map((user, i) => {
                  return (
                    <p key={i} className="row-user">
                      {i === 0 && (
                        <FontAwesomeIcon icon={faTrophy} className="mx-1" />
                      )}
                      <b>{user.username}</b> with {user.clicks} clicks!{" "}
                      {i === 0 && (
                        <FontAwesomeIcon icon={faTrophy} className="mx-1" />
                      )}
                    </p>
                  );
                })}
              {isLocal && (
                <button className="btn-click mt-5" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          )}
          <div className="room-info">
            {timer !== undefined && (
              <h2 className="text-center">{timer} seconds remaining!</h2>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default RoomGame;
