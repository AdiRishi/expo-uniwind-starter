# Use Compiled Internal Packages And Turbo

Shared code that crosses workspace boundaries lives in compiled internal packages under `packages/`, starting with `@repo/rpc` for tRPC transport configuration and `@repo/typescript-config` for package compiler defaults. Turbo owns the monorepo task graph so downstream workspaces typecheck, test, and build against declared package dependencies instead of raw server implementation files. This keeps the mobile app free of Nitro runtime details and makes future shared app/server code explicit in `package.json`.
