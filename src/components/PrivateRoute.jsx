import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    console.log("checking for login");
    return <h1>Loading</h1>;
  }

  console.log(loggedIn);

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

  


export default PrivateRoute