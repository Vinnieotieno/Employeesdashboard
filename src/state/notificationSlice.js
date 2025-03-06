import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {}, // Store notification count for each room
  reducers: {
    setNotificationCount: (state, action) => {
      const { room, count } = action.payload;
      state[room] = count;
    },
    resetNotifications: () => {
      return {};
    },
  },
});

export const { setNotificationCount, resetNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
