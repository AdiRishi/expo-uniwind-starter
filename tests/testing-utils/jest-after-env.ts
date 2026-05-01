import { notifyManager } from "@tanstack/react-query";
import { act } from "@testing-library/react-native";

notifyManager.setNotifyFunction((callback) => {
  // React Query schedules observer notifications after promises settle. Wrapping
  // the shared notifier keeps those deferred updates inside React's test act boundary.
  act(callback);
});
