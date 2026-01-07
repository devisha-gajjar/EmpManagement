import { render } from "@testing-library/react";
import { DashboardCard, InfoText, CenteredContainer } from "./DashboardCard";

describe("Dashboard UI Components – Snapshot Tests", () => {
  describe("DashboardCard", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <DashboardCard title="User Statistics">
          <div>Some dashboard content</div>
        </DashboardCard>
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("InfoText", () => {
    it("matches snapshot when value is provided", () => {
      const { container } = render(
        <InfoText label="Total Users" value="150" />
      );

      expect(container).toMatchSnapshot();
    });

    it("matches snapshot when value is null (fallback)", () => {
      const { container } = render(
        <InfoText label="Active Users" value={null} />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("CenteredContainer", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <CenteredContainer>
          <span>Centered Content</span>
        </CenteredContainer>
      );

      expect(container).toMatchSnapshot();
    });
  });
});
