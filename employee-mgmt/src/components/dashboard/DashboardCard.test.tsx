import { render, screen } from "@testing-library/react";
import { DashboardCard, InfoText, CenteredContainer } from "./DashboardCard";

describe("DashboardCard component", () => {
  it("renders the title", () => {
    render(
      <DashboardCard title="User Stats">
        <div>Content</div>
      </DashboardCard>
    );

    expect(screen.getByText("User Stats")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DashboardCard title="Dashboard">
        <span data-testid="child">Child Content</span>
      </DashboardCard>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("InfoText component", () => {
  it("renders label and value", () => {
    render(<InfoText label="Total Users" value="150" />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders fallback when value is null", () => {
    render(<InfoText label="Active Users" value={null} />);

    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders fallback when value is undefined", () => {
    render(<InfoText label="Inactive Users" value={undefined} />);

    expect(screen.getByText("Inactive Users")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("CenteredContainer component", () => {
  it("renders children", () => {
    render(
      <CenteredContainer>
        <div>Centered Content</div>
      </CenteredContainer>
    );

    expect(screen.getByText("Centered Content")).toBeInTheDocument();
  });
});
