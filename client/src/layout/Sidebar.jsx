import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

//add reduc to the project for maintaining the state!
const Sidebar = ({
  rooms,
  roomChangeHandler,
  room,
  addUser,
  socket,
  addRoom,
  userId,
}) => {
  const [isAddUser, setIsAddUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersNotInRoom, setUsersNotInRoom] = useState([]);
  const [isAddRoom, setIsAddRoom] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (room && isAddUser) {
      setUsersNotInRoom([]);
      const usersFetcher = async () => {
        const roomUsers = await axios.get(
          `http://localhost:3000/rooms/${room}`
        );

        const users = await axios.get("http://localhost:3000/users/getall");

        const roomUserIds = roomUsers.data.users.map((el) => el._id);

        users.data.forEach((elem) => {
          if (!roomUserIds.includes(elem._id)) {
            setUsersNotInRoom((prev) => [...prev, elem]);
          }
        });
      };
      usersFetcher();
    }
  }, [isAddUser, room]);

  const saveChangeHandler = async () => {
    if (isAddRoom) {
      const { data } = await axios.post(`http://localhost:3000/rooms`, {
        name: roomName,
        userId,
      });

      addRoom(data);
      setRoomName("");
      setIsAddRoom(false);
    } else {
      const ids = selectedUsers.map((el) => el._id);
      await axios.put(`http://localhost:3000/rooms/${room}`, {
        userIds: ids,
      });

      const { data } = await axios.get(`http://localhost:3000/rooms/${room}`);

      const modRoom = {
        _id: data._id,
        name: data.name,
        users: data.users,
      };

      socket.current.emit("addToRoom", ids, modRoom);
      addUser(selectedUsers);
      setIsAddUser(false);
      setSelectedUsers([]);

      const updatedUsersNotInRoom = usersNotInRoom.filter(
        (el) => !selectedUsers.includes(el)
      );

      setUsersNotInRoom(updatedUsersNotInRoom);
    }
  };

  // useEffect(() => {
  //   if (room) {
  //     setIsAddUser(true);
  //   }
  // }, [room]);

  let content;

  if (!room && !isAddRoom) {
    content = (
      <>
        <div className="upper">
          {rooms.map((el) => (
            <li
              className=""
              key={el._id}
              onClick={() => roomChangeHandler(el._id)}
            >
              {el.name}
            </li>
          ))}
        </div>
        <div className="lower">
          <button onClick={() => setIsAddRoom(true)}>New Room</button>
        </div>
      </>
    );
  } else if (!room && isAddRoom) {
    content = (
      <>
        <div className="upper">
          <h1>Add Room</h1>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="lower">
          <button onClick={() => setIsAddRoom(false)}>Cancel</button>
        </div>
      </>
    );
  } else if (room && isAddRoom) {
    content = (
      <>
        <div className="upper">
          <h1>Add Room</h1>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="lower">
          <button onClick={() => setIsAddRoom(false)}>Cancel</button>
        </div>
      </>
    );
  } else if (room && isAddUser) {
    content = (
      <>
        <div className="upper">
          {usersNotInRoom?.map((el) => (
            <div className="flex" key={el._id}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers((prev) => [...prev, el]);
                  } else {
                    const newArr = selectedUsers.filter(
                      (element) => element._id !== el._id
                    );
                    setSelectedUsers(newArr);
                  }
                }}
              />
              <h4>{el.name}</h4>
            </div>
          ))}
        </div>
        <div className="lower">
          <button onClick={() => setIsAddUser(false)}>Cancel</button>
          <button onClick={() => setIsAddRoom(true)}>Add Room</button>
        </div>
      </>
    );
  } else if (room && !isAddUser) {
    content = (
      <div className="">
        <div className="upper flex flex-col list-none text-xl font-semibold">
          {rooms.map((el) => (
            <li
              className={el._id === room ? "prim py-3" : " py-3"}
              key={el._id}
              onClick={() => roomChangeHandler(el._id)}
            >
              {el.name}
            </li>
          ))}
        </div>
        <div className="lower flex flex-col items-start">
          <button
            className="sec w-full pr-2 rounded-sm"
            onClick={() => setIsAddUser(true)}
          >
            Add Friends
          </button>
          <button
            className="prim w-full pr-2 rounded-sm"
            onClick={() => setIsAddRoom(true)}
          >
            Add Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/5">
      {isAddRoom || isAddUser ? (
        <button onClick={saveChangeHandler}>Save Changes</button>
      ) : (
        ""
      )}
      {content}
    </div>
  );
};

export default Sidebar;
