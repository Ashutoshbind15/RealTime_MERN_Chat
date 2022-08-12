import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { useContext } from "react";
import { io } from "socket.io-client";
import ChatRoom from "../components/ChatRoom";
import AuthContext from "../context/AuthContext";
import Sidebar from "../layout/Sidebar";

const Messenger = () => {
  const [room, setRoom] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentMsg, setCurretnMsg] = useState(null);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const [usersInRoom, setUsersinRoom] = useState([]);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await axios.post(
        "http://localhost:3000/rooms/getrooms",
        { userId: user.user._id }
      );

      setRoom(data);
    };

    fetchRooms();
  }, [user.user._id]);

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.emit("addUsers", user.user._id);

    socket.current.on("rmessage", (data, room, sender) => {
      setCurretnMsg({
        sender: { _id: sender._id, name: sender.name },
        text: data,
        _id: Math.random().toString(),
        room,
      });
    });
  }, [user.user._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentRoom) {
        const { data } = await axios.get(
          `http://localhost:3000/rooms/${currentRoom}`
        );
        setMsgs(data.chats);
        setUsersinRoom(data.users);
      }
    };

    fetchMessages();
  }, [currentRoom]);

  useEffect(() => {
    currentMsg &&
      currentRoom === currentMsg.room &&
      setMsgs((prev) => [...prev, currentMsg]);
  }, [currentRoom, currentMsg]);

  const roomChangeHandler = (id) => {
    setCurrentRoom(id);
  };

  const submissionHandler = async (input) => {
    const { data } = await axios.post(
      `http://localhost:3000/rooms/${currentRoom}`,
      { text: input, sender: user.user._id }
    );
    const usersInRoom = data.users;
    const receipients = usersInRoom.filter((u) => u !== user.user._id);

    //setting the currently sent msg randomly instead of fetching back correct later
    setMsgs((prev) => [
      ...prev,
      { _id: Math.random().toString(), text: input, sender: user._id },
    ]);

    socket.current.emit("message", input, receipients, currentRoom, user);
  };

  const addUser = useCallback((users) => {
    setUsersinRoom((prev) => [...prev, ...users]);
  }, []);

  const addRoom = useCallback((room) => {
    setRoom((prev) => [...prev, room]);
  }, []);

  useEffect(() => {
    socket.current.on("addToRoom", (room) => {
      setRoom((prev) => [...prev, room]);
    });
  }, []);

  return (
    <div className="flex p-4">
      <Sidebar
        addRoom={addRoom}
        roomChangeHandler={roomChangeHandler}
        rooms={room}
        room={currentRoom}
        addUser={addUser}
        socket={socket}
        userId={user.user._id}
      />
      <ChatRoom
        submissionHandler={submissionHandler}
        msgs={msgs}
        users={usersInRoom}
      />
      {/* {room.map((el) => (
        <button onClick={() => setCurrentRoom(el._id)} key={el._id}>
          {el.name}
        </button>
      ))}

       {msgs.length ? msgs.map((el) => <li key={el._id}>{el.text}</li>) : ""} 
      */}
    </div>
  );
};

export default Messenger;
