import mongoose from "mongoose";

const groupSchema =
  new mongoose.Schema(
    {
      name: String,

      groupPic: {
        type: String,
        default: "",
      },

      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      members: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );
const Group = mongoose.model(
  "Group",
  groupSchema
);

export default Group;