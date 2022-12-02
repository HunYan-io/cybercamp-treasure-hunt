import mongoose from "mongoose";
import { InferedSchemaType } from "../utils/types";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    required: true,
  },
  tasks: [
    {
      task: {
        type: Number,
        required: true,
      },
      solvedAt: Date,
      startedAt: {
        type: Date,
        required: true,
      },
      submits: {
        type: Number,
        required: true,
      },
      unlimitedSubmits: {
        type: Boolean,
        required: true,
      },
      frozenAt: Date,
      hinted: {
        type: Boolean,
        required: true,
      },
      gambleAmount: {
        type: Number,
        required: true,
      },
    },
  ],
  relativeStrikes: {
    type: Number,
    required: true,
  },
  relativeCoins: {
    type: Number,
    required: true,
  },
  currentTask: Number,
  chips: [
    {
      id: {
        type: Number,
        required: true,
      },
      boughtAt: {
        type: Date,
        required: true,
      },
      currentTask: Number,
      metadata: mongoose.Schema.Types.Mixed,
    },
  ],
});

// computed:
// 	strikes: number
// 	eliminated: boolean
// 	coins: number

const Team = mongoose.model("Team", schema);

export type ITeam = InferedSchemaType<typeof Team>;

export default Team;
