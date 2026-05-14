import superjson from "superjson";

// Keep the tRPC transformer owned by the server package. App code and tests import
// this single value so future custom serializers are added once and used everywhere.
export const superjsonTransformer = superjson;
