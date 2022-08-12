import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, dispatchUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    dispatchUser({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="text-lg p-4 font-bold flex prim sticky top-0 text-white">
      <Link className="flex-1 font-bold uppercase" to={"/chats"}>
        Chat_App
      </Link>
      <div className="flex  px-6">
        <div className="cursor-pointer" onClick={logoutHandler}>
          Logout
        </div>
        {<div className="mx-4 cursor-pointer">{user?.user.name}</div>}
        <Link to="/friends">Friends</Link>
      </div>
    </div>
  );
};

export default Navbar;
