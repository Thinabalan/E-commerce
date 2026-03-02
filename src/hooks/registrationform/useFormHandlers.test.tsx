import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useFormHandlers } from "./useFormHandlers";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

const mockTrigger = vi.fn();
const mockGetValues = vi.fn();
const mockSetValue = vi.fn();
const mockReset = vi.fn();

vi.mock("react-hook-form", () => ({
    useFormContext: () => ({
        control: {},
        trigger: mockTrigger,
        getValues: mockGetValues,
        setValue: mockSetValue,
        reset: mockReset,
    }),
    useFieldArray: () => ({
        fields: [],
        append: vi.fn(),
        remove: vi.fn(),
    }),
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
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("../../context/UIContext", () => ({
    useUI: () => ({
        showSnackbar: mockSnackbar,
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

it("does not navigate if addRegistration fails", async () => {
  mockAdd.mockResolvedValue(null);

  const { result } = renderHook(() => useFormHandlers());

  await act(async () => {
    await result.current.onSubmit(mockPayload);
  });

  expect(mockNavigate).not.toHaveBeenCalled();
  expect(mockSnackbar).not.toHaveBeenCalled();
});