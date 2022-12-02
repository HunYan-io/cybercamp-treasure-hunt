import mongoose from "mongoose";

export type InferedSchemaType<T> = T extends mongoose.Model<infer U>
  ? U & { _id: mongoose.Types.ObjectId }
  : never;
