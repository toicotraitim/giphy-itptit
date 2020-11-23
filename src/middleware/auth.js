import axios from 'axios';
import {SERVER_URL} from '../config.json';
export const getUser = () => axios.post(SERVER_URL+"/api/checkToken", {token: localStorage.getItem("auth-token")})
                                    .then(res => res.data)
                                    .catch(err => {
                                        // if(localStorage.getItem("auth-token"))localStorage.removeItem("auth-token");
                                        return err;
                                    });