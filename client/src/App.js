import { Route, Routes } from "react-router-dom";

import Navbar from "./layout/Navbar";
import Friends from "./pages/Friends";
import Home from "./pages/Home";
import Messenger from "./pages/Messenger";

function App() {
  return (
    <>
      <Navbar />
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Messenger />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </>
    </>
  );
}

export default App;
