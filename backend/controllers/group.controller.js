import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { io } from "../lib/socket.js";
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = await Group.create({
      name,
      admin: req.user._id,

      members: [req.user._id, ...members],
    });

    res.status(201).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    });

    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getGroupMessages = async (
  req,
  res
) => {
  try {
    const { groupId } = req.params;

    const messages =
      await GroupMessage.find({
        groupId,
      }).populate(
        "senderId",
        "fullName profilePic"
      );

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
};
export const sendGroupMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: groupId } = req.params;

    const message = await GroupMessage.create({
      senderId: req.user._id,
      groupId,
      text,
    });

    const populatedMessage =
      await GroupMessage.findById(message._id)
        .populate(
          "senderId",
          "fullName profilePic"
        );

    io.to(groupId).emit(
      "newGroupMessage",
      populatedMessage
    );

    res.status(201).json(
      populatedMessage
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getGroupMembers = async (
  req,
  res
) => {
  try {
    const group = await Group.findById(
      req.params.groupId
    ).populate(
      "members",
      "fullName profilePic"
    );

    res.status(200).json(group.members);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const addMember = async (
  req,
  res
) => {
  try {
    const group =
      await Group.findById(
        req.params.groupId
      );

    if (
      group.admin.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    const { userId } = req.body;

    const updatedGroup =
      await Group.findByIdAndUpdate(
        req.params.groupId,
        {
          $addToSet: {
            members: userId,
          },
        },
        { new: true }
      );

    res
      .status(200)
      .json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const removeMember = async (
  req,
  res
) => {
  try {
    const group =
      await Group.findById(
        req.params.groupId
      );

    if (
      group.admin.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Only admin can remove members",
      });
    }

    const { userId } = req.body;

    const updatedGroup =
      await Group.findByIdAndUpdate(
        req.params.groupId,
        {
          $pull: {
            members: userId,
          },
        },
        { new: true }
      );

    res
      .status(200)
      .json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const leaveGroup = async (
  req,
  res
) => {
  try {
    const group =
      await Group.findByIdAndUpdate(
        req.params.groupId,
        {
          $pull: {
            members: req.user._id,
          },
        },
        {
          new: true,
        }
      );

    res.status(200).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const deleteGroup = async (
  req,
  res
) => {
  try {
    const group =
      await Group.findById(
        req.params.groupId
      );

    if (
      group.admin.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Group.findByIdAndDelete(
      req.params.groupId
    );

    await GroupMessage.deleteMany({
      groupId: req.params.groupId,
    });

    res.status(200).json({
      message:
        "Group deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};