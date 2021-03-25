import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "firebase/database";
import "../src/styles/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ModalLogin from "./modalLogin";
import ModalCreateUsername from "./modalCreateUsername";

function App() {
  const [listGames, setListGames] = useState([]);
  const [user, setUser] = useState({ username: "", maxScore: 0 });
  const [roomName, setRoomName] = useState("");

  document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref("users")
          .on("value", (snapshot) => {
            if (snapshot.val() !== null) {
              Object.entries(snapshot.val()).forEach((value) => {
                if (value[1].email && value[1].email === user.email) {
                  sessionStorage.setItem("user", value[1].username);
                  sessionStorage.setItem("userKey", value[0]);
                  setUser({
                    username: value[1].username,
                    maxScore: value[1].maxScore,
                  });
                  return;
                }
              });
            }
          });
      }
    });
  });

  useEffect(() => {
    function updateUserName(name){
      setUser( {username: name} );
    }
    let mounted = true;
    firebase
      .database()
      .ref(`games`)
      .on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          if (mounted) {
            setListGames(snapshot.val());
          }
        } else {
          setListGames({});
        }
      });
    let currentUser = sessionStorage.getItem("user");
    console.log(currentUser, sessionStorage.getItem("user"))
    if (!!currentUser) {
      updateUserName(currentUser)
    }else{
      document.getElementById("btnModal").click();
    }

    return () => (mounted = false);
  }, []);

  //Function for create room
  const handleCreate = () => {
    let newGameRef, newRoomName;
    newGameRef = firebase.database().ref("games/").push();
    if (roomName === "") {
      newRoomName = user.username + "'s room";
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
    sessionStorage.setItem("actualIDGame", newGameRef.key);
    sessionStorage.setItem("actualOwner", user.username);
    window.location.href = "/" + newGameRef.key;
  };

  //Function for enter room
  const handleEnterGame = (idGame, owner, visitor) => {
    if (visitor) {
      Swal.fire({
        icon: "warning",
        title: "Room is full",
        toast: true,
        showConfirmButton: false,
        position: "bottom-end",
        timer: 3000,
      });
    } else {
      sessionStorage.setItem("actualIDGame", idGame);
      sessionStorage.setItem("actualOwner", owner);
      if (owner !== user) {
        firebase
          .database()
          .ref(`games/${idGame}/visitorUser`)
          .update({ username : user.username });
      }
    }
  };

  //Function for handle input room name
  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleLoginGuest = (user) => {
    sessionStorage.setItem("user", user);
    setUser({username: user});
    document.getElementById("btnModal").click();
  };

  const handleLoginGoogle = (data) => {
    //Check if user is new
    let userEmail = data.user.email;
    let userNew = true;
    firebase
      .database()
      .ref("users")
      .on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          Object.entries(snapshot.val()).forEach((value) => {
            if (value[1].email && value[1].email === userEmail) {
              userNew = false;
              sessionStorage.setItem("user", value[1].username);
              sessionStorage.setItem("userKey", value[0]);
              setUser({
                username: value[1].username,
                maxScore: value[1].maxScore,
                email: value[1].email,
              });
              return;
            }
          });
          document.getElementById("btnModal").click();
          if (userNew) {
            let ref = firebase.database().ref("users").push();
            ref.set({
              email: userEmail,
              maxScore: 0,
              username: data.user.displayName,
            });
            // TODO Change name for username selected by user
            sessionStorage.setItem("user", data.user.displayName);
            sessionStorage.setItem("userKey", ref.key);
            setUser(data.user.displayName);
            document.getElementById("btnModalUsername").click();
          }
        }
      });

  };

  const handleLogOut = () => {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    setUser({ ...user, username: "", maxScore: 0 });
    sessionStorage.clear("user")
    document.getElementById("btnModal").click();
  };

  return (
    <>
      <div className="main">
        <button
          type="button"
          hidden
          data-bs-toggle="modal"
          data-bs-target="#modalLogin"
          id="btnModal"
        ></button>
        <button
          type="button"
          hidden
          data-bs-toggle="modal"
          data-bs-target="#modalCreateUsername"
          id="btnModalUsername"
        ></button>
        <div className="row row-home h-100 w-100">
          <div className="col-lg-4 order-md-2 create-section">
            <h1 className="text-center mb-4">Click battle!</h1>
            <button
              className="btn-click mb-3 mb-md-5"
              disabled={!!!user.username}
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
              placeholder={`${user.username}'s room`}
            />
          </div>
          <div className="col-lg-8 order-md-1 rooms-section">
            <h2>Available rooms</h2>
            {Object.entries(listGames).length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 h-100">
                {Object.entries(listGames).map((game, i) => {
                  return (
                    <div key={i} className="col col-card mb-3">
                      <Link to={game[1].visitorUser ? "/" : `/${game[0]}`}>
                        <div
                          className="card card-room shadow-sm"
                          onClick={() =>
                            handleEnterGame(
                              game[0],
                              game[1].localUser.username,
                              game[1].visitorUser
                            )
                          }
                        >
                          <div
                            className={`card-body ${
                              game[1].visitorUser ? "card-full" : ""
                            }`}
                          >
                            <p>
                              <b>
                                {game[1].roomName !== ""
                                  ? game[1].roomName
                                  : `Sala N°${i}`}
                              </b>
                            </p>
                            <span>Owner: {game[1].localUser.username}</span>
                          </div>
                          <div className="txt-cant-users">
                            <FontAwesomeIcon icon={faUser} className="mx-1" />
                            {game[1].visitorUser ? "2/2" : "1/2"}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h4 className="h-100">
                No available rooms right now, create one!
              </h4>
            )}
          </div>
        </div>
        <footer className="mt-auto">
          {user.username !== "" && (
            <div className="txt-user text-center">
              {" "}
              logged as {user.username} -{" "}
              <span onClick={() => handleLogOut()}>Log out</span>{" "}
            </div>
          )}
          <div className="footer text-end mx-5">
            <a
              href="https://cafecito.app/leanlescano"
              rel="noreferrer"
              target="_blank"
            >
              <img
                srcSet="https://cdn.cafecito.app/imgs/buttons/button_2.png 1x, https://cdn.cafecito.app/imgs/buttons/button_2_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_2_3.75x.png 3.75x"
                src="https://cdn.cafecito.app/imgs/buttons/button_2.png"
                alt="Invitame un café en cafecito.app"
              />
            </a>
          </div>
        </footer>
      </div>
      <ModalLogin
        user={user}
        loginGuest={(name) => handleLoginGuest(name)}
        close={() => document.getElementById("btnModal").click()}
        loginGoogle={(name) => handleLoginGoogle(name)}
      />
      <ModalCreateUsername
        close={() => document.getElementById("btnModalUsername").click()}
      />
    </>
  );
}

export default App;
