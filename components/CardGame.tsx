import React from "react";
import Link from "next/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

interface GameRoom {
  listUsers: [];
  maxUsers: number;
  ownerUser: { username: string };
  visitorUser: string;
  roomName: string;
  password: string;
}

type AppProps = {
  game: [number, GameRoom];
  handleEnterGame: Function;
  roomNumber: number;
};

function CardGame({ game, handleEnterGame, roomNumber }: AppProps) {
  return (
    <div className="col col-card mb-3">
      {/* <Link
        href={
          game[1].listUsers &&
          Object.keys(game[1].listUsers).length === game[1].maxUsers
            ? "/"
            : `/game/${game[0]}`
        }
      > */}
      <div
        className="card card-room shadow-sm"
        onClick={() =>
          handleEnterGame(
            game[0],
            game[1].ownerUser.username,
            game[1].listUsers,
            game[1].maxUsers,
            game[1].password
          )
        }
      >
        <div className={`card-body ${game[1].visitorUser ? "card-full" : ""}`}>
          <p>
            <b>
              {game[1].roomName !== ""
                ? game[1].roomName
                : `Sala N°${roomNumber}`}
              {game[1].password ? (
                <FontAwesomeIcon icon={faLock} className="mx-1" />
              ) : null}
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
            ? `${Object.keys(game[1].listUsers).length}/${game[1].maxUsers}`
            : `1/${game[1].maxUsers}`}
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}

export default CardGame;
