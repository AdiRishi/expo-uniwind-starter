import { notifyManager } from "@tanstack/react-query";
import { act } from "@testing-library/react-native";

notifyManager.setNotifyFunction((callback) => {
  // React Query schedules observer notifications after promises settle. Wrapping
  // the shared notifier keeps deferred cache updates inside React's test act boundary
  // instead of making every mutation test manually flush Query internals.
  act(callback);
});
