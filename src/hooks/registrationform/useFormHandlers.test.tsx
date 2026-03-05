import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useFormHandlers } from "./useFormHandlers";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

const mockTrigger = vi.fn();
const mockGetValues = vi.fn();
const mockSetValue = vi.fn();
const mockReset = vi.fn();

const mockWarehouseAppend = vi.fn();
const mockWarehouseRemove = vi.fn();

const mockBusinessAppend = vi.fn();
const mockBusinessRemove = vi.fn();

const mockProductAppend = vi.fn();
const mockProductRemove = vi.fn();

vi.mock("react-hook-form", () => ({
    useFormContext: () => ({
        control: {},
        trigger: mockTrigger,
        getValues: mockGetValues,
        setValue: mockSetValue,
        reset: mockReset,
    }),
    useFieldArray: ({ name }: any) => {
        if (name === "seller.warehouses") {
            return {
                fields: [],
                append: mockWarehouseAppend,
                remove: mockWarehouseRemove,
            };
        }

        if (name === "businesses") {
            return {
                fields: [],
                append: mockBusinessAppend,
                remove: mockBusinessRemove,
            };
        }

        if (name.includes("products")) {
            return {
                fields: [],
                append: mockProductAppend,
                remove: mockProductRemove,
            };
        }

        return { fields: [], append: vi.fn(), remove: vi.fn() };
    },
}));

const mockAdd = vi.fn();
const mockUpdate = vi.fn();
const mockGet = vi.fn();

vi.mock("./useRegistration", () => ({
    useRegistration: () => ({
        addRegistration: mockAdd,
        updateRegistration: mockUpdate,
        getRegistrationById: mockGet,
    }),
}));

const mockSnackbar = vi.fn();
const mockShowDialog = vi.fn();
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("../../context/UIContext", () => ({
    useUI: () => ({
        showSnackbar: mockSnackbar,
        showDialog: mockShowDialog,
    }),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockUseParams(),
    };
});

const mockPayload: RegistrationForm = {
    seller: {
        name: "bala",
        email: "bala@test.com",
        warehouses: [
            {
                warehouseName: "Main Warehouse",
                city: "Chennai",
                pincode: "600001",
                upload: null,
                isSaved: true,
            },
        ],
    },
    businesses: [
        {
            businessName: "Electronics",
            businessEmail: "electronics@test.com",
            additionaldetails: "",
            products: [
                {
                    productName: "Mobile",
                    price: "10000",
                    stock: "50",
                    category: "Electronics",
                    isSaved: false,
                },
            ],
        },
    ],
};

beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({});
});

it("calls addRegistration in create mode", async () => {
    mockAdd.mockResolvedValue(true);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.onSubmit(mockPayload);
    });

    expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
            businesses: [
                expect.objectContaining({
                    products: [
                        expect.objectContaining({ isSaved: true }),
                    ],
                }),
            ],
        })
    );
    expect(mockSnackbar).toHaveBeenCalledWith(
        "Form submitted successfully",
        "success"
    );
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/registrations");
});

it("calls updateRegistration in edit mode", async () => {
    mockUpdate.mockResolvedValue(true);

    mockUseParams.mockReturnValue({ id: "123" });

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.onSubmit(mockPayload);
    });

    expect(mockUpdate).toHaveBeenCalledWith("123", expect.any(Object));
    expect(mockSnackbar).toHaveBeenCalledWith(
        "Form updated successfully",
        "success"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/registrations");
});

it("opens reset confirmation dialog", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.handleReset();
    });

    expect(mockShowDialog).toHaveBeenCalledWith({
        title: "Reset Form?",
        description: "Are you sure you want to clear the form?",
        confirmText: "Reset",
        onConfirm: expect.any(Function),
    });
});

it("resets form and shows snackbar when confirmed", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.handleReset();
    });

    const dialogConfig = mockShowDialog.mock.calls[0][0];

    act(() => {
        dialogConfig.onConfirm();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockSnackbar).toHaveBeenCalledWith(
        "Form reset successfully",
        "info"
    );
});

it("does not navigate if addRegistration fails", async () => {
    mockAdd.mockResolvedValue(null);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.onSubmit(mockPayload);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSnackbar).not.toHaveBeenCalled();
});

it("fetchRegistrationData resets form when data exists", async () => {
    mockGet.mockResolvedValue({ seller: {}, businesses: [] });

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.fetchRegistrationData("123");
    });

    expect(mockReset).toHaveBeenCalledWith({
        seller: {},
        businesses: [],
    });
});

it("navigates if no data found", async () => {
    mockGet.mockResolvedValue(null);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.fetchRegistrationData("123");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/registrations");
});

it("opens business panel only", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.handleFormError({ businesses: true });
    });

    expect(result.current.expanded[1]).toBe(true);
});

it("opens both panels when both errors exist", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.handleFormError({
            seller: true,
            businesses: true,
        });
    });

    expect(result.current.expanded[0]).toBe(true);
    expect(result.current.expanded[1]).toBe(true);
});

// WAREHOUSE
// Append (Valid)
it("appends warehouse with correct default structure", async () => {
    mockGetValues.mockReturnValue([]);
    mockTrigger.mockResolvedValue(true);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.addWarehouse();
    });

    expect(mockWarehouseAppend).toHaveBeenCalledWith({
        warehouseName: "",
        city: "",
        pincode: "",
        upload: null,
        isSaved: false,
    });
});

// Append (Invalid)
it("does not append warehouse if last warehouse invalid", async () => {
    mockGetValues.mockReturnValue([{}]); // one existing
    mockTrigger.mockResolvedValue(false); // validation fails

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.addWarehouse();
    });

    expect(mockWarehouseAppend).not.toHaveBeenCalled();
});

// Remove
it("removes warehouse", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.removeWarehouse(1);
    });

    expect(mockWarehouseRemove).toHaveBeenCalledWith(1);
});

// Limit Reached
it("shows warning when warehouse limit reached", async () => {
    mockGetValues.mockReturnValue([{}, {}, {}]);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.addWarehouse();
    });

    expect(mockSnackbar).toHaveBeenCalled();
});

// Save Warehouse
it("sets warehouse isSaved true when valid", async () => {
    mockTrigger.mockResolvedValue(true);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.saveWarehouse(0);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
        "seller.warehouses.0.isSaved",
        true
    );
});

// Edit Warehouse
it("sets warehouse isSaved false when editing", () => {
    const { result } = renderHook(() => useFormHandlers());

    act(() => {
        result.current.editWarehouse(0);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
        "seller.warehouses.0.isSaved",
        false
    );
});

// BUSINESS
it("shows warning when business limit reached", async () => {
    mockGetValues.mockReturnValue([{}, {}, {}]);

    const { result } = renderHook(() => useFormHandlers());

    await act(async () => {
        await result.current.addBusiness();
    });

    expect(mockSnackbar).toHaveBeenCalled();
});

// PRODUCT
// Save Product
it("sets product isSaved true when valid", async () => {
    mockTrigger.mockResolvedValue(true);

    const { result } = renderHook(() => useFormHandlers());

    const handlers = result.current.getProductHandlers(0);

    await act(async () => {
        await handlers.saveProduct(0);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
        "businesses.0.products.0.isSaved",
        true
    );
});

// Edit Product
it("sets product isSaved false when editing", () => {
    const { result } = renderHook(() => useFormHandlers());

    const handlers = result.current.getProductHandlers(0);

    act(() => {
        handlers.editProduct(0);
    });

    expect(mockSetValue).toHaveBeenCalledWith(
        "businesses.0.products.0.isSaved",
        false
    );
});

