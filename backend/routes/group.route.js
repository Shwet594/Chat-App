import express from "express";

import {
  createGroup,
  getGroups,
  getGroupMessages,
  sendGroupMessage,
  addMember,
  deleteGroup,
  leaveGroup,
  removeMember,
  getGroupMembers
} from "../controllers/group.controller.js";

import { protectRoute }
  from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/creategroup",
  protectRoute,
  createGroup
);
router.put(
  "/:groupId/leave",
  protectRoute,
  leaveGroup
);
router.put(
  "/:groupId/add-member",
  protectRoute,
  addMember
);
router.put(
  "/:groupId/remove-member",
  protectRoute,
  removeMember
);
router.delete(
  "/:groupId",
  protectRoute,
  deleteGroup
);
router.get(
  "/:groupId/members",
  protectRoute,
  getGroupMembers
);
router.get(
  "/messages/:groupId",
  protectRoute,
  getGroupMessages
);
router.post(
  "/send/:id",
  protectRoute,
  sendGroupMessage
);
router.get(
  "/getgroups",
  protectRoute,
  getGroups
);

export default router;