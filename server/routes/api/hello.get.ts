import { defineHandler } from "nitro/h3";

export default defineHandler(async () => {
  return {
    message: "Hello from Nitro!",
    timestamp: new Date().toISOString(),
  };
});
