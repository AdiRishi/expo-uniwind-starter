import { render } from "@testing-library/react-native";

import { AppTabs } from "@/components/app-tabs";

describe("<AppTabs />", () => {
  test("renders the starter tab workspaces", () => {
    const { getByText } = render(<AppTabs />);

    getByText("Home");
    getByText("Explore");
    getByText("Tasks");
  });
});
