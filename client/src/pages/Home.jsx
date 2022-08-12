import React from "react";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const { dispatchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState(false);

  const submissionHandler = async (e) => {
    e.preventDefault();

    if (login) {
      const { data } = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      });

      if (data) {
        dispatchUser({ type: "LOGIN", payload: data });
        navigate("/chats");
      }
    } else {
      const { data } = await axios.post(
        "http://localhost:3000/users/register",
        {
          name,
          email,
          password,
        }
      );

      if (data) {
        dispatchUser({ type: "LOGIN", payload: data });
        navigate("/chats");
      }
    }
  };

  return (
    <div className="flex items-start">
      <div
        className="cont flex flex-col justify-center items-center mx-6 flex-1
    "
      >
        <form
          onSubmit={submissionHandler}
          className="flex flex-col items-start py-40"
        >
          <h1 className="text-lg font-bold primText uppercase mb-4 leading-8">
            Welcome to my Chat App!
          </h1>
          {!login && (
            <input
              className="my-2 w-full px-4 py-2  border-black border-b-2 focus:scale-110 focus:outline-none transition primBorder"
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="my-2 w-full px-4 py-2  border-black border-b-2 focus:scale-110 focus:outline-none transition primBorder"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            className="my-2 w-full px-4 py-2  border-black border-b-2 focus:scale-110 focus:outline-none transition primBorder"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!login && (
            <input
              className="my-2 w-full px-4 py-2  border-black border-b-2 focus:scale-110 focus:outline-none transition primBorder"
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button
            type="button"
            className="prim w-full my-2 rounded-lg py-1 font-bold text-lg p-2"
            onClick={() => setLogin((prev) => !prev)}
          >
            {!login ? "Have an Account? Login" : "Register"}
          </button>
          <button
            type="submit"
            className="sec w-full my-2 rounded-lg py-1 font-bold text-lg"
          >
            Submit
          </button>
        </form>
      </div>
      <img
        className="justify-end w-7/12 py-4 rounded-sm h-screen self-end"
        src="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
        alt=""
      />
    </div>
  );
};

export default Home;
