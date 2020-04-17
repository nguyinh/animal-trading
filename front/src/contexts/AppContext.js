import React, { useReducer, useEffect } from "react";
import { connectUser, logOutUser } from "../services";

let reducer = (state, action) => {
  // const { some } = state;

  switch (action.type) {
    case "SET_USER":
      return setUser(state, action.user);
    case "DISABLE_LOADING":
      return { ...state, isAutoConnecting: false };
    case "LOG_OUT":
      return logout(state);
    default:
      return state;
  }
};

const setUser = (state, user) => {
  return {
    ...state,
    currentUser: user,
    isAutoConnecting: false,
  };
};

const logout = async (state) => {
  await logOutUser();

  return {
    ...state,
    currentUser: null,
    isAutoConnecting: true,
  };
};

const initialState = {
  currentUser: null,
  isAutoConnecting: true,
};

const AppContext = React.createContext(initialState);

function AppProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function connect() {
      try {
        const user = await connectUser();

        dispatch({ type: "SET_USER", user });
      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "DISABLE_LOADING" });
      }
    }

    connect();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}
export { AppContext, AppProvider };
