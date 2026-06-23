# @repo/rpc

This package makes the tRPC transport contract explicit and shared by the app and server.

Keep it narrow: it owns serialization configuration, not routers, procedures, auth, HTTP clients, or feature API helpers.
