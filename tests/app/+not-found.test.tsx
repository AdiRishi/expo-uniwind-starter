import { fireEvent } from "@testing-library/react-native";
import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { useRouter } from "expo-router";

import NotFoundScreen from "@/app/+not-found";

const mockRouter = {
  replace: jest.fn(),
};

// Route tests own their router mock so navigation expectations stay explicit at
// the assertion site instead of being hidden in the global Jest setup.
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

describe("app/+not-found", () => {
  beforeEach(() => {
    mockRouter.replace.mockClear();
  });

  test("explains the missing page and returns home", () => {
    const router = useRouter();
    const { getByText } = renderWithTestProviders(<NotFoundScreen />);

    getByText("Page not found");
    getByText("The page you're looking for doesn't exist or has been moved.");

    fireEvent.press(getByText("Go home"));

    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
