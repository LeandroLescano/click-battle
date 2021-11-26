import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  update,
  onValue,
  get,
  onDisconnect,
  remove,
  push,
  child,
  set,
} from "@firebase/database";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCog } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/dist/client/router";
import Swal from "sweetalert2";
import { requestPassword } from "../../components/Alerts";

interface User {
  username: string;
  clicks: number;
  rol?: string;
  maxScore?: number;
  key?: string;
  kickOut?: boolean;
}

function RoomGame() {
  const [isLocal, setIsLocal] = useState(false);
  const [idGame, setIdGame] = useState<String>();
  const [roomName, setRoomName] = useState<String>();
  const [maxUsers, setMaxUsers] = useState(2);
  const [start, setStart] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [localUser, setLocalUser] = useState<User>({
    username: "",
    clicks: 0,
  });
  const [listUsers, setListUsers] = useState<User[]>([
    { username: "", clicks: 0, rol: "visitor" },
  ]);
  const [timer, setTimer] = useState(10);
  const [timeToStart, setTimeToStart] = useState(3);
  const router = useRouter();
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    let idGame = sessionStorage.getItem("actualIDGame");
    let pathIdGame = window.location.pathname.slice(1).substring(5);
    let user = localStorage.getItem("user");
    let userOwner = sessionStorage.getItem("actualOwner");
    onDisconnect(ref(db, `games/${idGame}/listUsers/${auth.currentUser?.uid}`))
      .remove()
      .catch((e) => console.error(e));
    if (user === userOwner) {
      return () => {
        let refGame = ref(db, `games/${idGame}`);
        remove(refGame);
      };
    } else {
      let refUser = ref(
        db,
        `games/${idGame}/listUsers/${auth.currentUser?.uid}`
      ).ref;
      get(refUser).then((data) => {
        if (data.val() === null) {
          let objUser = {
            username: user!,
            clicks: 0,
            key: auth.currentUser?.uid,
          };
          setLocalUser(objUser);
          let userRef = ref(db, `games/${idGame}/listUsers`);
          if (idGame === pathIdGame) {
            let localUserRef = child(userRef, `${auth.currentUser?.uid}`);
            set(localUserRef, objUser);
          }
        }
      });
      return () => {
        let refGame = ref(
          db,
          `games/${idGame}/listUsers/${auth.currentUser?.uid}`
        );
        remove(refGame);
      };
    }
  }, [auth]);

  //useEffect for update all data in state
  useEffect(() => {
    let idGame = sessionStorage.getItem("actualIDGame");
    let pathIdGame = window.location.pathname.slice(1).substring(5);
    // if (idGame !== pathIdGame) {
    //   router.push("/");
    //   return;
    // }
    let actualUser = localStorage.getItem("user");
    let id = window.location.pathname.slice(1).substring(5);
    setIdGame(id);
    // sessionStorage.setItem("actualIDGame", id);
    let refGame = ref(db, `games/${id}/`);
    onValue(refGame, (snapshot) => {
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
        let listUsers: User[] = [];
        let listUsersDB: User[] = snapshot.val().listUsers;
        Object.entries(listUsersDB).forEach((val) => {
          if (!val[1].kickOut) {
            let objUser: User = {
              username: val[1].username,
              clicks: val[1].clicks,
              rol: val[1].rol,
              maxScore: val[1].maxScore,
              key: val[0],
            };
            if (val[0] === auth.currentUser?.uid) {
              setLocalUser(objUser);
            }
            listUsers.push(objUser);
          } else if (val[0] === auth.currentUser?.uid) {
            router.query.kickedout = "true";
            router.push({ pathname: "/", query: { kickedOut: true } });
          }
        });
        setListUsers(listUsers);
        if (snapshot.val().ownerUser.username === actualUser) {
          setIsLocal(true);
        } else {
          if (snapshot.val().password && idGame !== pathIdGame) {
            requestPassword(snapshot.val().password).then((val) => {
              if (val.isConfirmed === false) {
                router.push("/");
              } else {
                sessionStorage.setItem("actualIDGame", pathIdGame);
              }
            });
          }
        }
      } else {
        router.replace("/");
      }
    });
  }, []);

  //useEffect for update timer in state and show result
  useEffect(() => {
    if (start) {
      if (!timer) {
        let refGame = ref(db, `games/${idGame}`);
        update(refGame, { timer: null });
        let userKey = sessionStorage.getItem("userKey");
        if (userKey && localUser.maxScore) {
          if (localUser.clicks > localUser.maxScore) {
            let refUser = ref(db, `users/${userKey}`);
            update(refUser, { maxScore: localUser.clicks });
          }
        }
        return;
      }

      const intervalId = setInterval(() => {
        let refGame = ref(db, `games/${idGame}`);
        update(refGame, { timer: timer - 1 });
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (startCountdown) {
      if (!timeToStart) {
        let refGame = ref(db, `games/${idGame}`);
        update(refGame, {
          gameStart: false,
          timeStart: null,
          currentGame: true,
        });
        return;
      }

      const intervalIdStart = setInterval(() => {
        let refGame = ref(db, `games/${idGame}`);
        update(refGame, { timeStart: timeToStart - 1 });
      }, 1000);
      return () => clearInterval(intervalIdStart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, start, timeToStart, startCountdown]);

  //function for update clicks
  const handleClick = () => {
    let refGame = ref(db, `games/${idGame}/listUsers/${auth.currentUser?.uid}`);
    update(refGame, { clicks: localUser.clicks + 1 });
  };

  //function for start game
  const handleStart = () => {
    let refGame = ref(db, `games/${idGame}`);
    update(refGame, { gameStart: true });
  };

  //function for reset all data
  const handleReset = () => {
    let refGame = ref(db, `games/${idGame}`);
    update(refGame, {
      timer: 10,
      gameStart: false,
      timeStart: 3,
      currentGame: false,
    });
    let refGameUsers = ref(db, `games/${idGame}/listUsers`);
    get(refGameUsers).then((snapshot) => {
      snapshot.forEach((child) => {
        update(child.ref, { clicks: 0 });
      });
    });
  };

  //function for kick users
  const kickUser = (userKey: string | null) => {
    if (userKey) {
      let userRef = ref(db, `games/${idGame}/listUsers/${userKey}`);
      update(userRef, { kickOut: true }).then(() => {
        Swal.fire({
          title: "The user has been kicked.",
          icon: "success",
          toast: true,
          showConfirmButton: false,
          position: "bottom-end",
          timer: 2500,
        });
      });
    }
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
          {/* <div className="float-right">
            <FontAwesomeIcon icon={faCog} className="mx-1 mb-1" size={"xs"} />
          </div> */}
          <div className="header py-4 flex-lg-row">
            <button
              className="btn-click p-2 btn-back me-auto mb-4"
              onClick={() => router.push("/")}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mx-1 mb-1"
                size={"xs"}
              />
              Go back
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
                      <div className={`${isLocal ? "col-2" : "col-4"} pe-4`}>
                        Clicks
                      </div>
                    </div>
                  ) : (
                    isLocal && <h4>Waiting for opponents...</h4>
                  )}
                  {listUsers
                    .filter((user) => user.key !== localUser.key)
                    .sort((a, b) => b.clicks - a.clicks)
                    .map((user, i) => {
                      return (
                        <div className="visitor-container" key={i}>
                          <div className="row row-user">
                            <div className="col-8 text-start">
                              {user.username}
                            </div>
                            <div className={isLocal ? "col-2" : "col-4"}>
                              {user.clicks}
                            </div>
                            {isLocal && (
                              <div
                                className="col-2"
                                onClick={() => kickUser(user.key || null)}
                              >
                                X
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="col-md-6 text-center">
                  <h4>You have {localUser.clicks} clicks!</h4>
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
                  <p className="mt-3 mb-0">{localUser.username}</p>
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
                    <p
                      key={i}
                      className={`row-user ${
                        user.username === localUser.username ? "local-row" : ""
                      }`}
                    >
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
