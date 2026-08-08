# @repo/contracts

The shape of data crossing the boundary between the app and the server: procedure input
schemas, and the payload types those procedures return.

The test for whether something belongs here is "do both sides have to agree on this?"
`createTaskSchema` qualifies — the server validates input with it and the app builds its
form against it, so declaring it twice is how a client starts accepting input the server
rejects. Business rules that would still exist with no API at all are not contracts;
give those their own package when you have some.

Keep it platform-free: no Expo, React Native, Nitro, or tRPC imports. Pure types and
schemas only, so both workspaces can consume it without dragging in each other's runtime.

It is a compiled internal package. Root scripts run `pnpm run compile` through Turbo
before workflows that depend on it.
