import * as C from '../constants'
import axios from "axios";
import { api } from "../../components/Constants/constants";

export const getUserLogged = () => {
    return function (dispatch) {
      axios(`${api}/auth/info`, { withCredentials: true })
        .then((response) => {
          dispatch({ type: C.getUserLogged, payload: response.data });
        })
        .catch( err => console.log( err ));
    };
  };