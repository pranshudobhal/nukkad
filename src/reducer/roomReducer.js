export const initialState = {
  roomID: null,
};

export const roomReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_ROOM':
      return { ...state, roomID: action.payload };

    default:
      throw new Error('Error in reducer');
  }
};
