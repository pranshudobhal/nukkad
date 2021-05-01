import { createContext, useContext, useReducer } from 'react';
import { roomReducer, initialState } from '../reducer/roomReducer';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  return (
    <RoomContext.Provider
      value={{
        roomID: state.roomID,
        roomDispatch: dispatch,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}
