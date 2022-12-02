import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hasNoTeam, hasTeam } from "../middlewares/team";
import User from "../models/user";
import { t } from "../trpc";
import {
  createPopulatedTeam,
  getPopulatedTeam,
  PopulatedTeam,
} from "../utils/team";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";

export const teamEvents = new EventEmitter();

export const teamRouter = t.router({
  join: t.procedure
    .use(hasNoTeam)
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await getPopulatedTeam({
        name: input.name,
        password: input.password,
      });
      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      await User.updateOne(
        {
          _id: ctx.user._id,
        },
        {
          $set: {
            team: team._id,
          },
        }
      );
      return team;
    }),
  create: t.procedure
    .use(hasNoTeam)
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let team: Omit<PopulatedTeam, "password">;
      try {
        team = await createPopulatedTeam(input.name, input.password);
      } catch (err) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      await User.updateOne(
        {
          _id: ctx.user._id,
        },
        {
          $set: {
            team: team._id,
          },
        }
      );
      return team;
    }),
  onUpdate: t.procedure.use(hasTeam).subscription(({ ctx }) => {
    return observable<Omit<PopulatedTeam, "password">>((emit) => {
      const onTeamUpdate = (data: Omit<PopulatedTeam, "password">) => {
        if (data._id.toString() === ctx.team._id.toString()) {
          emit.next(data);
        }
      };
      teamEvents.on("update", onTeamUpdate);
      return () => {
        teamEvents.off("update", onTeamUpdate);
      };
    });
  }),
});
