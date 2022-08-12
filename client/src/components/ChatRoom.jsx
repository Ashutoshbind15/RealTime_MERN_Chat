import React from "react";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../context/AuthContext";

const ChatRoom = ({ submissionHandler, msgs, users }) => {
  console.log(msgs);

  const { user } = useContext(AuthContext);

  const [input, setInp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    submissionHandler(input);
    setInp("");
  };

  return (
    <div className="w-4/5 px-4">
      <div className="upper">
        {users.length ? (
          <div className="flex sec items-center justify-center p-3 text-xl">
            {users.map((el) => (
              <li key={Math.random().toString()} className="list-none mx-1 ">
                {el.name}
              </li>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col py-2">
          {msgs.length
            ? msgs.map((el) => (
                <li
                  className={`list-none my-2 w-7/12 rounded-md px-2 py-2 shadow-lg flex justify-between ${
                    el.sender._id === user.user._id
                      ? "prim self-end"
                      : "bg-white"
                  }`}
                  key={el._id}
                >
                  <span>{el.text}</span>{" "}
                  <span>
                    - {el.sender._id === user.user._id ? "You" : el.sender.name}
                  </span>
                </li>
              ))
            : ""}
        </div>
      </div>
      <form
        action=""
        onSubmit={handleSubmit}
        className="lower flex items-end pb-4 pr-6"
      >
        <input
          className="w-full"
          type="text"
          value={input}
          onChange={(e) => setInp(e.target.value)}
          placeholder="message"
        />
        <br />

        <button onSubmit={submissionHandler} className="sec rounded-lg px-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
