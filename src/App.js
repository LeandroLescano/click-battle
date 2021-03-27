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
  const [maxUsers, setMaxUsers] = useState(2);

  //Function for detect google acount users
  document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let finded = false;
        firebase
          .database()
          .ref("users")
          .on("value", (snapshot) => {
            if (snapshot.val() !== null) {
              Object.entries(snapshot.val()).forEach((value) => {
                if (value[1].email && value[1].email === user.email) {
                  finded = true;
                  sessionStorage.setItem("user", value[1].username);
                  sessionStorage.setItem("userKey", value[0]);
                  setUser({
                    username: value[1].username,
                    maxScore: value[1].maxScore,
                    email: value[1].email,
                  });
                }
              });
              if (!finded) {
                document.getElementById("btnModal").click();
              }
            }
          });
      }
    });
  });

  useEffect(() => {
    //If exist userKey get user from DB
    function updateUserName(name) {
      let key = sessionStorage.getItem("userKey");
      if (key !== null) {
        firebase
          .database()
          .ref(`users/${key}`)
          .once("value", (snapshot) => {
            setUser({
              username: snapshot.val().username,
              maxScore: snapshot.val().maxScore,
              email: snapshot.val().email,
            });
          });
      } else {
        setUser({
          username: name,
          maxScore: 0,
        });
      }
    }
    let mounted = true;
    //Get rooms of games from DB
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
    //If user name exist, update it on state
    let currentUser = sessionStorage.getItem("user");
    console.log(currentUser, sessionStorage.getItem("user"));
    console.log(currentUser, !!currentUser);
    if (!!currentUser) {
      updateUserName(currentUser);
    } else {
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
      listUsers: [{ username: user.username, clicks: 0, rol: "owner" }],
      ownerUser: user,
      visitorUser: null,
      timeStart: 3,
      timer: 10,
      maxUsers: +maxUsers,
    });
    sessionStorage.setItem("actualIDGame", newGameRef.key);
    sessionStorage.setItem("actualOwner", user.username);
    sessionStorage.setItem("gameUserKey", 0);
    window.location.href = "/" + newGameRef.key;
  };

  //Function for enter room
  const handleEnterGame = (idGame, owner, actualUsers, maxUsers) => {
    console.log(Object.keys(actualUsers).length);
    if (Object.keys(actualUsers).length === maxUsers) {
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
        let userKey = firebase
          .database()
          .ref(`games/${idGame}/listUsers`)
          .push({ username: user.username, clicks: 0, rol: "visitor" }).key;
        sessionStorage.setItem("gameUserKey", userKey);
      }
    }
  };

  //Function for handle input room name
  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

  //Function for update maxUsers for the new room
  const handleNumberUsers = (e) => {
    setMaxUsers(e.target.value);
  };

  //Function for login a guest user
  const handleLoginGuest = (user) => {
    sessionStorage.setItem("user", user);
    setUser({ username: user });
    document.getElementById("btnModal").click();
  };

  //Function for login a Google account user
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
          if (userNew) {
            let ref = firebase.database().ref("users").push();
            ref.set({
              email: userEmail,
              maxScore: 0,
              username: data.user.displayName,
            });
            sessionStorage.setItem("userKey", ref.key);
            setUser(data.user.displayName);
            document.getElementById("btnModal").click();
            document.getElementById("btnModalUsername").click();
          }
        }
      });
  };

  //Function for logout user.
  const handleLogOut = () => {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    setUser({ ...user, username: "", maxScore: 0 });
    sessionStorage.clear("user");
    sessionStorage.clear("userKey");
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
            <span>Max number of users</span>
            <select
              className="form-name mb-2"
              label="Room name"
              value={maxUsers}
              onChange={(ref) => handleNumberUsers(ref)}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="col-lg-8 order-md-1 rooms-section">
            <h2>Available rooms</h2>
            {Object.entries(listGames).length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 h-100">
                {Object.entries(listGames).map((game, i) => {
                  return (
                    <div key={i} className="col col-card mb-3">
                      <Link
                        to={
                          Object.keys(game[1].listUsers).length ===
                          game[1].maxUsers
                            ? "/"
                            : `/${game[0]}`
                        }
                      >
                        <div
                          className="card card-room shadow-sm"
                          onClick={() =>
                            handleEnterGame(
                              game[0],
                              game[1].ownerUser.username,
                              game[1].listUsers,
                              game[1].maxUsers
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
                            <span>
                              Owner: <br />
                              {game[1].ownerUser.username}
                            </span>
                          </div>
                          <div className="txt-cant-users">
                            <FontAwesomeIcon icon={faUser} className="mx-1" />
                            {game[1].listUsers
                              ? `${Object.keys(game[1].listUsers).length}/${
                                  game[1].maxUsers
                                }`
                              : `1/${game[1].maxUsers}`}
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
        {user.email && (
          <div className="score-container float-right">
            Max score: {user.maxScore}
          </div>
        )}
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
