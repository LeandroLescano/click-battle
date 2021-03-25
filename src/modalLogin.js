import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import GoogleButton from "react-google-button";

function ModalLogin(props) {
  const [isMobile, setIsMobile] = useState(false);
  // const [user, setUser] = useState("");

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
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

  return (
    <div
      className="modal fade"
      id="modalLogin"
      tabIndex="-1"
      aria-labelledby="modalLoginLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLoginLabel">
              Login
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 text-center align-self-center">
                <h5>Login as guest</h5>
                <input
                  type="text"
                  className="form-name mb-2"
                  label="username"
                  value={props.user}
                  placeholder="Username"
                  onChange={(ref) => props.handleChange(ref.target.value)}
                />
                <br />
                <button
                  className="btn-click py-2 px-3 mb-3"
                  onClick={() => props.loginGuest()}
                >
                  Login
                </button>
              </div>
              <div
                className={`col-md-6 text-center align-self-center ${
                  isMobile ? "border-top" : "border-start"
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
