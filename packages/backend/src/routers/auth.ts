import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isAuth, isNotAuth } from "../middlewares/auth";
import User, { AuthUser, authUserFields, IUser } from "../models/user";
import { t } from "../trpc";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pick } from "../utils/object";
import { getPopulatedTeam, PopulatedTeam } from "../utils/team";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not set");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authRouter = t.router({
  signup: t.procedure
    .use(isNotAuth)
    .input(
      z.object({
        nickname: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<AuthUser> => {
      const hash = await bcrypt.hash(input.password, 10);
      let user: IUser;
      try {
        user = await User.create({
          nickname: input.nickname,
          email: input.email,
          password: hash,
        });
      } catch (err) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      return new Promise((resolve, reject) => {
        jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          (err: Error | null, token: string | undefined) => {
            if (err || !token) {
              return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR" }));
            }
            if (ctx.res) {
              ctx.res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365,
              });
            }
            const authUser: AuthUser = pick(user, authUserFields);
            return resolve(authUser);
          }
        );
      });
    }),
  login: t.procedure
    .use(isNotAuth)
    .input(
      z.object({
        nickname: z.string(),
        password: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{
        user: AuthUser;
        team: Omit<PopulatedTeam, "password"> | null;
      }> => {
        const user = await User.findOne({
          nickname: input.nickname,
        }).lean();
        if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        const isPasswordCorrect = await bcrypt.compare(
          input.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return new Promise((resolve, reject) => {
          jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            async (err: Error | null, token: string | undefined) => {
              if (err || !token) {
                return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR" }));
              }
              if (ctx.res) {
                ctx.res.cookie("token", token, {
                  httpOnly: true,
                  maxAge: 1000 * 60 * 60 * 24 * 365,
                });
              }
              const team = await getPopulatedTeam({ _id: user.team });
              return resolve({ user: pick(user, authUserFields), team });
            }
          );
        });
      }
    ),
  logout: t.procedure.use(isAuth).mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie("token");
    }
  }),
  data: t.procedure.use(isAuth).query(async ({ ctx }) => {
    if (!ctx.user.team) {
      return { user: ctx.user, team: null };
    }
    const team = await getPopulatedTeam({ _id: ctx.user.team });
    return { user: ctx.user, team: team };
  }),
});
