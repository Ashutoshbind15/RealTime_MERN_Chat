import { useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import AuthReducer from "./AuthReducer";

const stateInit = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const AuthContext = createContext(stateInit);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatchUser] = useReducer(AuthReducer, stateInit);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
