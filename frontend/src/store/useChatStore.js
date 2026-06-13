import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],

  selectedUser: null,
  selectedGroup: null,

  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/messages/users");

      set({
        users: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({
        messages: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  sendMessage: async (messageData) => {
  try {
    const { selectedUser } = get();

    const res=await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );
      set({
      messages: [...get().messages, res.data],
    });

    // DON'T set messages here
    // socket event will handle it
  } catch (error) {
    console.log(error);
  }
},

  subscribeToMessages: () => {
  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const currentUser = get().selectedUser;

    if (!currentUser) return;

    const isValid =
      newMessage.senderId === currentUser._id ||
      newMessage.receiverId === currentUser._id;

    if (!isValid) return;

    const exists = get().messages.some(
      (msg) => msg._id === newMessage._id
    );

    if (exists) return;

    set({
      messages: [...get().messages, newMessage],
    });
  });
},

  unsubscribeFromMessages: () => {
    socket.off("newMessage");
  },

  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups/getgroups");

      set({
        groups: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getGroupMessages: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/groups/messages/${groupId}`);

      set({
        messages: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  sendGroupMessage: async (messageData) => {
    try {
      const { selectedGroup } = get();

      await axiosInstance.post(
        `/groups/send/${selectedGroup._id}`,
        messageData,
      );

      // socket event will update state
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();

    if (!selectedGroup) return;

    // JOIN ROOM
    socket.emit("joinGroup", selectedGroup._id);

    socket.off("newGroupMessage");

    socket.on("newGroupMessage", (message) => {
      const currentGroup = get().selectedGroup;

      if (!currentGroup) return;

      if (message.groupId.toString() !== currentGroup._id.toString()) {
        return;
      }

      const exists = get().messages.some((msg) => msg._id === message._id);

      if (exists) return;

      set({
        messages: [...get().messages, message],
      });
    });
  },

  unsubscribeFromGroupMessages: () => {
    const currentGroup = get().selectedGroup;

    if (currentGroup) {
      socket.emit("leaveGroup", currentGroup._id);
    }

    socket.off("newGroupMessage");
  },

  setSelectedUser: (user) =>
    set({
      selectedUser: user,
      selectedGroup: null,
      messages: [],
    }),
  getGroupMembers: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/members`);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  addMember: async (groupId, userId) => {
    try {
      await axiosInstance.put(`/groups/${groupId}/add-member`, { userId });

      await get().getGroups();
    } catch (error) {
      console.log(error);
    }
  },

  removeMember: async (groupId, userId) => {
    try {
      await axiosInstance.put(`/groups/${groupId}/remove-member`, { userId });

      await get().getGroups();
    } catch (error) {
      console.log(error);
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.put(`/groups/${groupId}/leave`);

      set({
        selectedGroup: null,
        messages: [],
      });

      await get().getGroups();
    } catch (error) {
      console.log(error);
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}`);

      set({
        selectedGroup: null,
        messages: [],
      });

      await get().getGroups();
    } catch (error) {
      console.log(error);
    }
  },

  createGroup: async (name, members) => {
    try {
      const res = await axiosInstance.post("/groups/creategroup", {
        name,
        members,
      });

      set({
        groups: [...get().groups, res.data],
      });
    } catch (error) {
      console.log(error);
    }
  },
  setSelectedGroup: (group) =>
    set({
      selectedGroup: group,
      selectedUser: null,
      messages: [],
    }),
}));
