import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "firebase/database";
import "../src/styles/styles.scss";

function App() {
  const [listGames, setListGames] = useState([]);
  const [user, setUser] = useState(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref(`games`)
      .on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          setListGames(snapshot.val());
        }
      });
    let currentUser = sessionStorage.getItem("user");
    if (!!currentUser) {
      setUser(currentUser);
    } else {
      login();
    }
  }, []);

  const handleCreate = () => {
    let newGameRef, newRoomName;
    newGameRef = firebase.database().ref("games/").push();
    if (roomName === "") {
      newRoomName = user + "'s room";
    } else {
      newRoomName = roomName;
    }
    newGameRef.set({
      roomName: newRoomName,
      currentGame: false,
      gameStart: false,
      local: 0,
      localUser: user,
      visitor: 0,
      visitorUser: null,
      timeStart: 3,
      timer: 10,
    });
    window.location.href = "/" + newGameRef.key;
  };

  const handleEnterGame = (idGame, owner) => {
    if (owner !== user) {
      firebase.database().ref(`games/${idGame}`).update({ visitorUser: user });
    }
  };

  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

  const login = () => {
    Swal.fire({
      title: "Please enter your name",
      input: "text",
    }).then((response) => {
      if (response.isConfirmed) {
        sessionStorage.setItem("user", response.value);
        setUser(response.value);
      }
    });
  };

  return (
    <>
      {/* <div className="main"> */}
      <div className="row h-100 py-4 px-4">
        <div className="col-md-4 order-md-2 create-section">
          <h1 className="text-center mb-4">Click battle!</h1>
          <button
            className="btn-click mb-3 mb-md-5"
            onClick={() => handleCreate()}
          >
            Create game
          </button>
          <span>Insert room name</span>
          <input
            type="text"
            className="form-name mb-2"
            label="Room name"
            value={roomName}
            onChange={(ref) => handleChange(ref)}
            placeholder={`${user}'s room`}
          />
        </div>
        <div className="col-md-8 order-md-1 rooms-section">
          <div className="row">
            <h2>Available rooms</h2>
            {Object.entries(listGames).map((game, i) => {
              return (
                <div key={i} className="col-auto mb-3">
                  <Link to={`/${game[0]}`}>
                    <div
                      className="card card-room shadow-sm"
                      onClick={() =>
                        handleEnterGame(game[0], game[1].localUSer)
                      }
                    >
                      <div className="card-body">
                        <p>
                          <b>
                            {game[1].roomName !== ""
                              ? game[1].roomName
                              : `Sala N°${i}`}
                          </b>
                        </p>
                        <span>Owner: {game[1].localUser}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {user !== null && (
        <div className="txt-user text-center"> logged as {user}</div>
      )}
      {/* </div> */}
    </>
  );
}

export default App;
