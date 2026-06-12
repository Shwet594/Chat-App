import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const CreateGroupModal = ({
  closeModal,
}) => {
  const {
    users,
    createGroup,
  } = useChatStore();

  const [name, setName] =
    useState("");

  const [selectedMembers,
    setSelectedMembers] =
    useState([]);

  const toggleMember = (id) => {
    if (
      selectedMembers.includes(id)
    ) {
      setSelectedMembers(
        selectedMembers.filter(
          (m) => m !== id
        )
      );
    } else {
      setSelectedMembers([
        ...selectedMembers,
        id,
      ]);
    }
  };

  const handleCreate =
    async () => {
      if (!name) return;

      await createGroup(
        name,
        selectedMembers
      );

      closeModal();
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-base-100 p-5 rounded-lg w-96">
        <h2 className="font-bold text-xl mb-4">
          Create Group
        </h2>

        <input
          className="input input-bordered w-full mb-4"
          placeholder="Group Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <div className="max-h-60 overflow-y-auto">
          {users.map((user) => (
            <label
              key={user._id}
              className="flex gap-2 mb-2"
            >
              <input
                type="checkbox"
                onChange={() =>
                  toggleMember(
                    user._id
                  )
                }
              />

              {user.fullName}
            </label>
          ))}
        </div>

        <button
          onClick={handleCreate}
          className="btn btn-primary mt-4 w-full"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;