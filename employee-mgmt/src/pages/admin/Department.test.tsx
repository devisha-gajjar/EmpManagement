import { render, screen } from "@testing-library/react";
import { Department } from "./Department";
import { fetchDepartments } from "../../features/admin/department/departmentApi";

// Mock the hooks and API
jest.mock("../../app/hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
  useSnackbar: jest.fn(),
}));

jest.mock("../../features/admin/department/departmentApi", () => ({
  fetchDepartments: jest.fn(),
}));

jest.mock("../../components/shared/page-header/PageHeader", () => ({
  __esModule: true,
  default: ({ title, subtitle }: any) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

import { useAppSelector, useAppDispatch, useSnackbar } from "../../app/hooks";

const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
const mockUseSnackbar = useSnackbar as jest.MockedFunction<typeof useSnackbar>;
const mockFetchDepartments = fetchDepartments as jest.MockedFunction<
  typeof fetchDepartments
>;

describe("Department Component", () => {
  let mockDispatch: jest.Mock;
  let mockSnackbar: {
    error: jest.Mock;
    success: jest.Mock;
    info: jest.Mock;
    warning: jest.Mock;
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockSnackbar = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    };

    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseSnackbar.mockReturnValue(mockSnackbar as any);
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<Department />);
  };

  // Helper function to create complete mock state
  const createMockState = (overrides: any = {}) => {
    return {
      auth: {
        isAuthenticated: true,
        token: null,
        role: null,
        userId: null,
        userName: null,
        loading: false,
        error: null,
        registerSuccess: null,
        returnUrl: null,
        ...overrides.auth,
      },
      department: {
        departments: [],
        loading: false,
        error: null,
        ...overrides.department,
      },
      loader: {},
      snackbar: {},
      dashboard: {},
      leaves: {},
      attendance: {},
      employee: {},
      departmentApi: {},
      employeeApi: {},
      attendanceApi: {},
      leavesApi: {},
      projectMembersApi: {},
      ...overrides,
    };
  };

  describe("Loading State", () => {
    it("should display loading spinner when loading is true", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: { departments: [], loading: true, error: null },
          })
        )
      );

      renderComponent();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByText("Loading departments...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should display error message when error exists", () => {
      const errorMessage = "Failed to fetch departments";
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: {
              departments: [],
              loading: false,
              error: errorMessage,
            },
          })
        )
      );

      renderComponent();

      expect(
        screen.getByText(`Error fetching departments: ${errorMessage}`)
      ).toBeInTheDocument();
    });
  });

  describe("Authentication", () => {
    it("should show error snackbar when user is not authenticated", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            auth: { isAuthenticated: false },
            department: { departments: [], loading: false, error: null },
          })
        )
      );

      renderComponent();

      expect(mockSnackbar.error).toHaveBeenCalledWith("Unauthorized Access!");
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should dispatch fetchDepartments when user is authenticated", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            auth: { isAuthenticated: true },
            department: { departments: [], loading: false, error: null },
          })
        )
      );

      renderComponent();

      expect(mockDispatch).toHaveBeenCalledWith(fetchDepartments());
    });
  });

  describe("Empty State", () => {
    it("should display 'No departments found' when departments array is empty", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: { departments: [], loading: false, error: null },
          })
        )
      );

      renderComponent();

      expect(screen.getByText("No departments found.")).toBeInTheDocument();
    });
  });

  describe("Departments List", () => {
    it("should render list of departments when data is available", () => {
      const mockDepartments = [
        { id: "1", name: "Engineering" },
        { id: "2", name: "Marketing" },
        { id: "3", name: "Sales" },
      ];

      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: {
              departments: mockDepartments,
              loading: false,
              error: null,
            },
          })
        )
      );

      renderComponent();

      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Marketing")).toBeInTheDocument();
      expect(screen.getByText("Sales")).toBeInTheDocument();
    });

    it("should render correct number of department items", () => {
      const mockDepartments = [
        { id: "1", name: "HR" },
        { id: "2", name: "Finance" },
      ];

      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: {
              departments: mockDepartments,
              loading: false,
              error: null,
            },
          })
        )
      );

      const { container } = renderComponent();

      // Query by the MuiListItem class or use container query
      const listItems = container.querySelectorAll(".MuiListItem-root");
      expect(listItems).toHaveLength(2);

      // Verify both department names are rendered
      expect(screen.getByText("HR")).toBeInTheDocument();
      expect(screen.getByText("Finance")).toBeInTheDocument();
    });
  });

  describe("Page Header", () => {
    it("should render PageHeader with correct props", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: { departments: [], loading: false, error: null },
          })
        )
      );

      renderComponent();

      expect(screen.getByTestId("page-header")).toBeInTheDocument();
      expect(screen.getByText("Department List")).toBeInTheDocument();
      expect(
        screen.getByText("Manage departments and organizational structure")
      ).toBeInTheDocument();
    });
  });

  describe("UseEffect Dependencies", () => {
    it("should call fetchDepartments only once on mount when authenticated", () => {
      mockUseAppSelector.mockImplementation((selector) =>
        selector(
          createMockState({
            department: { departments: [], loading: false, error: null },
          })
        )
      );

      const { rerender } = renderComponent();

      expect(mockDispatch).toHaveBeenCalledTimes(1);

      // Rerender without changing props
      rerender(<Department />);

      // Should still be called only once due to useEffect dependencies
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
