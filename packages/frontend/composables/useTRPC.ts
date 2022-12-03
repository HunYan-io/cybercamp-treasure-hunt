import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  TRPCClientError,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "../../backend/src/index";
import superjson from "superjson";

function resolveWebsocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  if (host === "localhost:3000") {
    return `${protocol}//localhost:8080/wstrpc`;
  }
  return `${protocol}//${window.location.host}/wstrpc`;
}

export const wsClient =
  typeof window !== "undefined"
    ? createWSClient({
        url: resolveWebsocketUrl(),
      })
    : null;

const tRPC = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        client: wsClient!,
      }),
      false: httpBatchLink({
        url: "/trpc",
      }),
    }),
  ],
});

export type AppTRPC = typeof tRPC;

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export default function useTRPC() {
  return tRPC;
}
