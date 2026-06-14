import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    users,
    groups,
    getUsers,
    getGroups,
    selectedUser,
    selectedGroup,
    setSelectedUser,
    setSelectedGroup,
    subscribeToUserUpdates
  } = useChatStore();

  const { onlineUsers, logout } =
    useAuthStore();

  const [showCreateGroup,
    setShowCreateGroup] =
    useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
    subscribeToUserUpdates();
  }, [onlineUsers]);

  return (
    <>
      <aside className="w-72 border-r border-base-300 flex flex-col">
        <div className="p-5 border-b border-base-300">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl">
              Chats
            </h1>

            <button
              onClick={logout}
              className="btn btn-sm"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <Link
              to="/profile"
              className="btn btn-sm flex-1"
            >
              Profile
            </Link>

            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={() =>
                setShowCreateGroup(true)
              }
            >
              + Group
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-3 font-bold text-sm text-gray-500">
            Users
          </div>

          {users.map((user) => (
            <button
              key={user._id}
              onClick={() =>
                setSelectedUser(user)
              }
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 ${
                selectedUser?._id ===
                user._id
                  ? "bg-base-300"
                  : ""
              }`}
            >
              <div className="relative">
                <img
                  src={
                    user.profilePic ||
                    "/avatar.png"
                  }
                  alt=""
                  className="size-12 rounded-full object-cover"
                />

                {onlineUsers.includes(
                  user._id
                ) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full" />
                )}
              </div>

              <p className="font-medium">
                {user.fullName}
              </p>
            </button>
          ))}

          <div className="p-3 font-bold text-sm text-gray-500 border-t border-base-300">
            Groups
          </div>

          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() =>
                setSelectedGroup(group)
              }
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 ${
                selectedGroup?._id ===
                group._id
                  ? "bg-base-300"
                  : ""
              }`}
            >
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                👥
              </div>

              <p className="font-medium">
                {group.name}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {showCreateGroup && (
        <CreateGroupModal
          closeModal={() =>
            setShowCreateGroup(false)
          }
        />
      )}
    </>
  );
};

export default Sidebar;