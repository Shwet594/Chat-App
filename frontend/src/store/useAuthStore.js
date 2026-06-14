import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,

  // ✅ CONNECT SOCKET (safe + fast)
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser) return;

    // prevent multiple connections
    if (socket.connected) return;

    socket.auth = {
      userId: authUser._id,
    };

    socket.connect();

    socket.off("getOnlineUsers");

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  // ✅ DISCONNECT SOCKET
  disconnectSocket: () => {
    if (socket.connected) {
      socket.off("getOnlineUsers");
      socket.disconnect();
    }
  },

  // ✅ SIGNUP
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });

      get().disconnectSocket();
      get().connectSocket();
    } catch (error) {
      console.log(error);
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });

      get().disconnectSocket();
      get().connectSocket();
    } catch (error) {
      console.log(error);
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      get().disconnectSocket();

      set({
        authUser: null,
        onlineUsers: [],
      });
    } catch (error) {
      console.log(error);
    }
  },

  // ✅ CHECK AUTH (OPTIMIZED)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });

      // ⚡ IMPORTANT: delay socket connect so UI loads first
      setTimeout(() => {
        get().disconnectSocket();
        get().connectSocket();
      }, 0);
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ UPDATE PROFILE
 updateProfile: async (data) => {
  try {
    const res = await axiosInstance.put(
      "/auth/update-profile",
      data
    );

    // update auth user
    set({ authUser: res.data });

    // 🔥 IMPORTANT: refresh sidebar users
    await get().getUsers();

    return res.data;
  } catch (error) {
    console.log(error);
  }
},
}));