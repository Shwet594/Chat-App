import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import GroupInfoModal from "./GroupInfoModal";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    getGroupMessages,
    selectedUser,
    selectedGroup,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messagesRef = useRef(null);

  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Load messages + subscribe
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
    }

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromGroupMessages();
    };
  }, [selectedUser, selectedGroup]);

  // Auto scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center text-base-content/60">
        Select a user or group
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-base-300 bg-base-100 shrink-0">
        {selectedUser && (
          <div className="flex items-center gap-3">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <h2 className="font-bold">{selectedUser.fullName}</h2>
          </div>
        )}

        {selectedGroup && (
          <button
            onClick={() => setShowGroupInfo(true)}
            className="flex items-center gap-3 hover:opacity-80"
          >
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              👥
            </div>

            <div className="text-left">
              <h2 className="font-bold">{selectedGroup.name}</h2>
              <p className="text-xs opacity-60">
                Click to manage group
              </p>
            </div>
          </button>
        )}
      </div>

      {/* MESSAGES (SCROLLABLE AREA) */}
      <div
        ref={messagesRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => {
          const isMe = selectedGroup
            ? message.senderId?._id === authUser._id
            : message.senderId?.toString() === authUser._id.toString();

          return (
            <div
              key={message._id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[70%]">
                {selectedGroup && !isMe && (
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={message.senderId?.profilePic || "/avatar.png"}
                      alt=""
                      className="size-7 rounded-full"
                    />
                    <span className="text-xs font-semibold">
                      {message.senderId?.fullName}
                    </span>
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl break-words ${
                    isMe
                      ? "bg-primary text-primary-content"
                      : "bg-base-300"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT (FIXED BOTTOM) */}
      <div className="shrink-0">
        <MessageInput />
      </div>

      {/* GROUP MODAL */}
      {showGroupInfo && selectedGroup && (
        <GroupInfoModal
          group={selectedGroup}
          closeModal={() => setShowGroupInfo(false)}
        />
      )}
    </div>
  );
};

export default ChatContainer;