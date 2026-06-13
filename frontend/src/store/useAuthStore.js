import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,
 connectSocket: () => {
  const { authUser } = get();
  if (!authUser || socket.connected) return;

  socket.auth = {
    userId: authUser._id,
  };

  socket.connect();

  socket.off("getOnlineUsers");

socket.on("getOnlineUsers", (users) => {
  set({ onlineUsers: users });
});
},
  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
    }
  },
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
    }
  },
  checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check");

    set({ authUser: res.data });

    socket.disconnect(); // 👈 important reset
    get().connectSocket();
  } catch (error) {
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
},
  updateProfile: async (data) => {
  try {
    const res = await axiosInstance.put(
      "/auth/update-profile",
      data
    );

    set({
      authUser: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
},
}));
