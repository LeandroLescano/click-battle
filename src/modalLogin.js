import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import GoogleButton from "react-google-button";

function ModalLogin(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [guestUser, setGuestUser] = useState("");

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  });

  window.addEventListener("load", () => {
    if (window.innerWidth > 992) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  });

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        props.loginGoogle(result);
      })
      .catch((error) => console.log(error.message))
      .finally(() => {
        props.close();
      });
  };

  const handleChange = (name) => {
    if (name.length <= 25) {
      setGuestUser(name);
    }
  };

  return (
    <div
      className="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      id="modalLogin"
      tabIndex="-1"
      aria-labelledby="modalLoginLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body content-login-modal">
            <div className="row w-100">
              <div className="col-lg-6 text-center align-self-center">
                <h5>Login as guest</h5>
                <form>
                  <input
                    type="text"
                    className="form-name mb-2"
                    label="username"
                    value={guestUser}
                    placeholder="Username"
                    onChange={(ref) => handleChange(ref.target.value)}
                  />
                  <br />
                  <button
                    className="btn-click py-2 px-3 mb-3"
                    onClick={() => props.loginGuest(guestUser)}
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
              <div
                className={`col-lg-6 text-center align-self-center ${
                  isMobile ? "border-top mt-4 pt-4" : "border-start"
                }`}
              >
                <h5>Login with Google</h5>
                <GoogleButton id="btnGoogle" onClick={() => handleLogin()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
