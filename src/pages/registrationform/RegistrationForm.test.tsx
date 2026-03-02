import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";
import userEvent from "@testing-library/user-event";
import { AllProviders } from "../../test-utils";

const mockUseFormHandlers = vi.fn();

vi.mock("../../hooks/registrationform/useFormHandlers", () => ({
    useFormHandlers: () => mockUseFormHandlers(),
}));

const mockShowDialog = vi.fn();

vi.mock("../../context/UIContext", () => ({
    useUI: () => ({
        showDialog: mockShowDialog,
    }),
}));

const renderForm = () => {
  return render(<RegistrationForm />, { wrapper: AllProviders });
};

const createMock = (overrides = {}) => ({
    warehouseFields: [],
    addWarehouse: vi.fn(),
    removeWarehouse: vi.fn(),
    saveWarehouse: vi.fn(),
    editWarehouse: vi.fn(),

    businessFields: [],
    addBusiness: vi.fn(),
    removeBusiness: vi.fn(),

    getProductHandlers: vi.fn(),

    expanded: {},
    handleAccordionChange: vi.fn(),
    handleToggleAll: vi.fn(),
    fetchRegistrationData: vi.fn(),
    handleFormError: vi.fn(),
    onSubmit: vi.fn(),
    isEditMode: false,
    id: null,
    reset: vi.fn(),

    ...overrides,
});

beforeEach(() => {
    mockUseFormHandlers.mockReturnValue(createMock());
});

it("renders create mode correctly", () => {
    renderForm();
    expect(screen.getByText("Registration Form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
});

it("renders edit mode correctly", () => {
    mockUseFormHandlers.mockReturnValue(
        createMock({ isEditMode: true, id: "123" })
    );

    renderForm();

    expect(screen.getByText("Edit Registration")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
});

it("calls toggle handler when clicking expand all", async () => {
    const mockToggle = vi.fn();

    mockUseFormHandlers.mockReturnValue(
        createMock({
            expanded: { 0: false },
            handleToggleAll: mockToggle,
        })
    );

    renderForm();

    await userEvent.click(screen.getByText(/expand all/i));

    expect(mockToggle).toHaveBeenCalled();
});


it("shows validation errors when submitting empty form", async () => {
    renderForm();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.click(submitButton);

    expect(
        await screen.findByText(/^Name is required$/i)
    ).toBeInTheDocument();
});

it("allows user to type seller name", async () => {
    renderForm();

    const input = screen.getByLabelText(/seller name/i);

    await userEvent.type(input, "bala");

    expect(input).toHaveValue("bala");
});

it("opens discard dialog when cancel clicked", async () => {
   mockUseFormHandlers.mockReturnValue(
        createMock({ isEditMode: true})
    );

    renderForm();

    await userEvent.click(screen.getByText("Cancel"));

    expect(mockShowDialog).toHaveBeenCalled();
});