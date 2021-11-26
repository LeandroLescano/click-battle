import React, { useState, useEffect, createRef } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  get,
  child,
  set,
  update,
} from "@firebase/database";
import { useRouter } from "next/dist/client/router";
import Swal from "sweetalert2";
import ModalLogin from "../components/modalLogin";
import ModalCreateUsername from "../components/modalCreateUsername";
import type { NextPage } from "next";
import { sha256 } from "../services/encode";
import CardGame from "../components/CardGame";
import { requestPassword } from "../components/Alerts";

type User = {
  username: string;
  clicks?: number;
  rol?: string;
  maxScore?: number;
  key?: string;
  email?: string;
};

const Home: NextPage = () => {
  const [listGames, setListGames] = useState([]);
  const [user, setUser] = useState<User>({ username: "" });
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [maxUsers, setMaxUsers] = useState(2);
  const router = useRouter();
  const db = getDatabase();
  const auth = getAuth();
  const btnModal = createRef<HTMLButtonElement>();
  const btnModalUsername = createRef<HTMLButtonElement>();

  useEffect(() => {
    //If exist userKey get user from DB
    let mounted = true;
    if (router.query.kickedOut === "true") {
      router.replace("/");
      Swal.fire({
        title: "You were kicked out by the owner.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    function updateUserName(name: string) {
      let key = sessionStorage.getItem("userKey");
      let objUser: User = JSON.parse(sessionStorage.getItem("objUser")!);
      if (objUser) {
        setUser(objUser);
      } else if (key !== null) {
        const refUsers = ref(db, `users/${key}`);
        onValue(refUsers, (snapshot: any) => {
          let obj = {
            username: snapshot.val().username,
            maxScore: snapshot.val().maxScore,
            email: snapshot.val().email,
          };
          setUser(obj);
          sessionStorage.setItem("objUser", JSON.stringify(obj));
        });
      } else {
        setUser({
          username: name,
        });
      }
    }
    //If user name exist, update it on state
    if (mounted) {
      auth.onAuthStateChanged((user: any) => {
        if (user) {
          if (user.isAnonymous) {
            let username = localStorage.getItem("user");
            if (user.uid && username) {
              localStorage.setItem("uid", user.uid);
              setUser({ username: username });
            }
          } else {
            let key = sessionStorage.getItem("userKey");
            let objUser = JSON.parse(sessionStorage.getItem("objUser")!);
            if (objUser) {
              if (!localStorage.getItem("user")) {
                localStorage.setItem("user", objUser.username);
              }
              setUser(objUser);
            } else if (key) {
              updateUserName("");
            } else {
              let finded = false;
              let refUsers = ref(db, "users");
              get(refUsers).then((snapshot) => {
                if (snapshot.val() !== null) {
                  let usersDB: User = snapshot.val();
                  Object.entries(usersDB).forEach((value: any) => {
                    if (value[1].email && value[1].email === user.email) {
                      finded = true;
                      let obj = {
                        username: value[1].username,
                        maxScore: value[1].maxScore,
                        email: value[1].email,
                      };
                      localStorage.setItem("user", value[1].username);
                      sessionStorage.setItem("userKey", value[0]);
                      setUser(obj);
                      sessionStorage.setItem("objUser", JSON.stringify(obj));
                    }
                  });
                  if (!finded) {
                    btnModal.current?.click();
                  }
                }
              });
            }
          }
        } else {
          let currentUser = localStorage.getItem("user");
          console.log(currentUser);
          if (!!currentUser) {
            updateUserName(currentUser);
          } else {
            btnModal.current?.click();
          }
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    //Get rooms of games from DB
    if (user.username !== "") {
      const refGames = ref(db, `games`);
      onValue(refGames, (snapshot) => {
        if (snapshot.val() !== null) {
          if (mounted) {
            setListGames(snapshot.val());
          }
        } else {
          setListGames([]);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user.username]);

  //Function for create room
  const handleCreate = () => {
    let newGameRef, newRoomName;
    newGameRef = ref(db, "games/");
    if (roomName === "") {
      newRoomName = user.username + "'s room";
    } else {
      newRoomName = roomName;
    }
    let userToPush: User = {
      username: user.username,
      clicks: 0,
      rol: "owner",
    };
    if (user.maxScore) {
      userToPush["maxScore"] = user.maxScore;
    }

    let objRoom = {
      roomName: newRoomName,
      currentGame: false,
      gameStart: false,
      // listUsers: [userToPush],
      // password: encryptPass,
      listUsers: [],
      ownerUser: user,
      visitorUser: null,
      timeStart: 3,
      timer: 10,
      maxUsers: +maxUsers,
    };
    let newKey = push(newGameRef, objRoom).key;
    let childNewGame = child(
      newGameRef,
      `${newKey}/listUsers/${auth.currentUser?.uid}`
    );
    set(childNewGame, userToPush);
    if (roomPassword !== "") {
      let refActualGame = ref(db, `games/${newKey}`);
      sha256(roomPassword).then((hash) =>
        update(refActualGame, { password: hash })
      );
    }
    if (newKey) {
      sessionStorage.setItem("actualIDGame", newKey);
      sessionStorage.setItem("actualOwner", user.username);
      sessionStorage.setItem("gameUserKey", "0");
      router.push("/game/" + newKey);
    } else {
      Swal.fire({
        icon: "error",
        title: "Ups! We couldn't create the room, please try again.",
        timer: 3000,
      });
    }
  };

  //Function for enter room
  const handleEnterGame = (
    idGame: string,
    owner: string,
    actualUsers: User[],
    maxUsers: number,
    password: string
  ) => {
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
      if (password) {
        requestPassword(password).then((val) => {
          console.log(val);
          if (val) configRoomToEnter(idGame, owner);
        });
      } else {
        configRoomToEnter(idGame, owner);
      }
    }
  };

  //Function for add actualGameID to sessionStorage and add new user to game in database
  const configRoomToEnter = (idGame: string, owner: string) => {
    sessionStorage.setItem("actualIDGame", idGame);
    sessionStorage.setItem("actualOwner", owner);
    if (owner !== user.username) {
      if (auth.currentUser?.uid) {
        let userToPush: User = {
          username: user.username,
          clicks: 0,
          rol: "visitor",
        };
        if (user.maxScore) {
          userToPush["maxScore"] = user.maxScore;
        }
        let refGame = ref(db, `games/${idGame}/listUsers`);
        let childRef = child(refGame, auth.currentUser.uid);
        set(childRef, userToPush);
        router.push(`game/${idGame}`);
      } else {
        console.error("Error loading useer to game");
      }
    }
  };

  //Function for handle input room name
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPassword(e.target.value);
  };

  //Function for update maxUsers for the new room
  const handleNumberUsers = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxUsers(Number(e.target.value));
  };

  //Function for login a guest user
  const handleLoginGuest = (user: string) => {
    localStorage.setItem("user", user);
    signInAnonymously(auth)
      .then(() => {
        console.log(auth.currentUser);
      })
      .catch((e) => console.error(e));
    setUser({ username: user });
    // document.getElementById("btnModal").click();
    btnModal.current?.click();
  };

  //Function for login a Google account user
  const handleLoginGoogle = (data: any) => {
    //Check if user is new
    let userEmail = data.user.email;
    let userNew = true;
    let refUsers = ref(db, "users");
    onValue(refUsers, (snapshot) => {
      if (snapshot.val() !== null) {
        Object.entries(snapshot.val()).forEach((value: any) => {
          if (value[1].email && value[1].email === userEmail) {
            userNew = false;
            localStorage.setItem("user", value[1].username);
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
          let refUsers = ref(db, "users");
          let newKeyUser = push(refUsers, {
            email: userEmail,
            maxScore: 0,
            username: data.user.displayName,
          }).key;
          if (newKeyUser) {
            sessionStorage.setItem("userKey", newKeyUser);
          } else {
            console.error("Error generating new user");
          }
          setUser(data.user.displayName);
          btnModal.current?.click();
          btnModalUsername.current?.click();
        }
      }
    });
  };

  //Function for logout user.
  const handleLogOut = () => {
    if (auth.currentUser) {
      auth.signOut();
    }
    setUser({ ...user, username: "", maxScore: 0 });
    localStorage.removeItem("user");
    sessionStorage.removeItem("userKey");
    btnModal.current?.click();
  };

  return (
    <>
      <div className="main">
        <button
          ref={btnModal}
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
          ref={btnModalUsername}
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
              data-label="Room name"
              value={roomName}
              onChange={(ref) => handleChange(ref)}
              placeholder={`${user.username}'s room`}
            />
            <span>Insert room password (op)</span>
            <input
              type="text"
              className="form-name mb-2"
              data-label="Password"
              value={roomPassword}
              onChange={(ref) => handleChangePass(ref)}
              placeholder={`Password`}
            />
            <span>Max number of users</span>
            <select
              className="form-name mb-2"
              data-label="Room name"
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
                {Object.entries(listGames).map((game: any, i) => {
                  return (
                    <CardGame
                      game={game}
                      key={i}
                      roomNumber={i}
                      handleEnterGame={(
                        key: string,
                        username: string,
                        list: User[],
                        maxUsers: number,
                        password: string
                      ) =>
                        handleEnterGame(key, username, list, maxUsers, password)
                      }
                    />
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
              <span className="btn-logout" onClick={() => handleLogOut()}>
                Log out
              </span>{" "}
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
        // user={user}
        loginGuest={(name: string) => handleLoginGuest(name)}
        close={() => document.getElementById("btnModal")!.click()}
        loginGoogle={(name: string) => handleLoginGoogle(name)}
      />
      <ModalCreateUsername close={() => btnModalUsername.current?.click()} />
    </>
  );
};

export default Home;
