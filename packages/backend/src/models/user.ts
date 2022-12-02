import mongoose from "mongoose";
import { InferedSchemaType } from "../utils/types";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
});

const User = mongoose.model("User", schema);

export type IUser = InferedSchemaType<typeof User>;

export const authUserFields = {
  _id: 1,
  email: 1,
  nickname: 1,
  team: 1,
} as const;

export type AuthUser = Pick<IUser, keyof typeof authUserFields>;

export default User;
