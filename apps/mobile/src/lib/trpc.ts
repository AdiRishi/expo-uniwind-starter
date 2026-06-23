import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@repo/api";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
