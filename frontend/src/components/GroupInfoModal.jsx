import {
  useEffect,
  useState,
} from "react";

import {
  useChatStore,
} from "../store/useChatStore";

const GroupInfoModal = ({
  group,
  closeModal,
}) => {
  const {
    users,
    getGroupMembers,
    addMember,
    removeMember,
    leaveGroup,
    deleteGroup,
  } = useChatStore();

  const [members,
    setMembers] =
    useState([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers =
    async () => {
      const data =
        await getGroupMembers(
          group._id
        );

      setMembers(data);
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-base-100 p-5 rounded-lg w-[500px]">
        <h2 className="font-bold text-xl mb-4">
          {group.name}
        </h2>

        <h3 className="font-semibold mb-2">
          Members
        </h3>

        {members.map(
          (member) => (
            <div
              key={member._id}
              className="flex justify-between mb-2"
            >
              <span>
                {
                  member.fullName
                }
              </span>

              <button
                className="btn btn-xs btn-error"
                onClick={async () => {
                  await removeMember(
                    group._id,
                    member._id
                  );

                  loadMembers();
                }}
              >
                Remove
              </button>
            </div>
          )
        )}

        <div className="divider">
          Add Member
        </div>

        {users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between mb-2"
          >
            <span>
              {user.fullName}
            </span>

            <button
              className="btn btn-xs btn-primary"
              onClick={async () => {
                await addMember(
                  group._id,
                  user._id
                );

                loadMembers();
              }}
            >
              Add
            </button>
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <button
            className="btn btn-warning flex-1"
            onClick={() =>
              leaveGroup(
                group._id
              )
            }
          >
            Leave
          </button>

          <button
            className="btn btn-error flex-1"
            onClick={() =>
              deleteGroup(
                group._id
              )
            }
          >
            Delete
          </button>
        </div>

        <button
          className="btn mt-3 w-full"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GroupInfoModal;