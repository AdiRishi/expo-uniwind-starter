import { fireEvent } from "@testing-library/react-native";
import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";

import { GenericErrorScreen } from "@/screens/error/generic-error-screen";

describe("<GenericErrorScreen />", () => {
  test("shows retry and home actions alongside useful error details", () => {
    const onRetry = jest.fn();
    const onGoHome = jest.fn();
    const { getByText } = renderWithTestProviders(
      <GenericErrorScreen
        title="Could not load tasks"
        message="Please try again before contacting support."
        errorDetails={{ code: 503, status: "Service unavailable" }}
        onRetry={onRetry}
        onGoHome={onGoHome}
      />,
    );

    getByText("Could not load tasks");
    getByText("Please try again before contacting support.");
    getByText("Error details");
    getByText("503");
    getByText("Service unavailable");

    fireEvent.press(getByText("Try again"));
    fireEvent.press(getByText("Go home"));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  test("keeps the fallback screen concise when no recovery actions are available", () => {
    const { getByText, queryByText } = renderWithTestProviders(<GenericErrorScreen />);

    getByText("Something went wrong");
    getByText("We encountered an unexpected issue while processing your request.");
    expect(queryByText("Try again")).toBeNull();
    expect(queryByText("Go home")).toBeNull();
    expect(queryByText("Error details")).toBeNull();
  });
});
