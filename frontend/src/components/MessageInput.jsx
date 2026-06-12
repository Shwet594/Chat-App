import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");

  const {
    sendMessage,
    sendGroupMessage,
    selectedGroup,
  } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (selectedGroup) {
      await sendGroupMessage({ text });
    } else {
      await sendMessage({ text });
    }

    setText("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="p-4 border-t border-base-300 bg-base-100"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder={
            selectedGroup
              ? "Message group..."
              : "Type message..."
          }
          className="input input-bordered flex-1"
        />

        <button
          type="submit"
          className="btn btn-primary px-6"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;