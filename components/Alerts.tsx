import Swal, { SweetAlertResult } from "sweetalert2";
import { sha256 } from "../services/encode";

const requestPassword = async (password: string): Promise<any> => {
  return await Swal.fire({
    title: "Enter the password",
    input: "password",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    confirmButtonText: "Enter",
    inputValidator: (val) => {
      if (!val) {
        return "Plese enter the password";
      }
      return null;
    },
    showLoaderOnConfirm: true,
    preConfirm: (pass) => {
      return sha256(pass).then((hash) => {
        if (hash !== password) {
          Swal.showValidationMessage("Incorrect password");
          return false;
        }
        return true;
      });
    },
  }).then((val) => val);
};

export { requestPassword };
