import { io } from "socket.io-client";
import React from "react";
const SOCKET_URL = "http://localhost:8000";
export const socket = io(SOCKET_URL, {
    withCredentials: true, 
});
// app context
export const AppContext = React.createContext();