/**
 * ---------------------
 * 🚗🚦 Generated by nuxt-typed-router. Do not modify !
 * ---------------------
 * */

import { useNuxtApp } from "#app";
import { TypedRouter, RouteListDecl } from "./typed-router";

/** Returns instances of $typedRouter and $routesList fully typed to use in your components or your Vuex/Pinia store
 *
 * @exemple
 *
 * ```ts
 * const { router, routes } = useTypedRouter();
 * ```
 */
export const useTypedRouter = (): {
  /** Export of $router with type check */
  router: TypedRouter;
  /** Contains a typed dictionnary of all your route names (for syntax sugar) */
  routes: RouteListDecl;
} => {
  const { $router } = useNuxtApp();

  const routesList = {
    chips: "chips",
    index: "index",
    login: "login",
    overview: "overview",
    register: "register",
    teamCreate: "team-create",
    team: "team",
    teamJoin: "team-join",
    testComponents: "test-components",
  };

  return {
    router: $router,
    routes: routesList,
  } as any;
};
