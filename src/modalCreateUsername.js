import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/database";

function ModalCreateUsername(props) {
  const [name, setName] = useState("");

  const handleChange = (name) => {
    if (name.length <= 25) {
      setName(name);
    }
  };

  const handleCreateUser = () => {
    if (name.length >= 3) {
      let key = sessionStorage.getItem("userKey");
      firebase.database().ref(`users/${key}`).update({ username: name });
      sessionStorage.setItem("user", name);
      props.close();
    }
  };

  return (
    <div
      className="modal fade"
      id="modalCreateUsername"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="modalCreateUsernameLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center">
            <h4>Enter your username</h4>
            <input
              type="text"
              className="form-name mb-2 me-5"
              label="username"
              value={name}
              placeholder="Username"
              onChange={(ref) => handleChange(ref.target.value)}
            />
            <button
              className="btn-click py-2 px-3 mb-3"
              onClick={() => handleCreateUser()}
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateUsername;
