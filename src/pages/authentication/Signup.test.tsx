import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Signup from "./Signup";
import userEvent from "@testing-library/user-event";
import { AllProviders } from "../../test-utils";

const mockGetUsers = vi.fn();
const mockCreateUser = vi.fn();
const mockShowSnackbar = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../hooks/useUser", () => ({
  useUser: () => ({
    getUsers: mockGetUsers,
    createUser: mockCreateUser,
  }),
}));

vi.mock("../../context/UIContext", () => ({
  useUI: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderForm = () => {
  return render(<Signup />, { wrapper: AllProviders });
};

it("renders form without crashing", () => {
  renderForm();
  expect(
    screen.getByText(/join us today/i)
  ).toBeInTheDocument();
});

it("shows submit button", () => {
  renderForm();

  const submitButton = screen.getByRole("button", {
    name: /sign up/i,
  });

  expect(submitButton).toBeInTheDocument();
});

it("shows validation errors when submitting empty form", async () => {
  renderForm();

  const submitButton = screen.getByRole("button", { name: /sign up/i });

  await userEvent.click(submitButton);

  expect(
    await screen.findByText(/^Name is required$/i)
  ).toBeInTheDocument();
});

it("allows user to type name", async () => {
  renderForm();

  const input = screen.getByLabelText(/full name/i);

  await userEvent.type(input, "bala");

  expect(input).toHaveValue("bala");
});

it("shows error for invalid email format", async () => {
  renderForm();
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/full name/i), "bala");
  await user.type(screen.getByLabelText(/email/i), "invalid-email");

  const passwords = screen.getAllByLabelText(/password/i);
  await user.type(passwords[0], "Password123!");
  await user.type(passwords[1], "Password123!");

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  expect(
    await screen.findByText(/Enter a valid email address/i)
  ).toBeInTheDocument();

  // Ensure API was NOT called
  expect(mockCreateUser).not.toHaveBeenCalled();
  expect(mockShowSnackbar).not.toHaveBeenCalled();
});

it("shows error when passwords do not match", async () => {
  renderForm();
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/full name/i), "bala");
  await user.type(screen.getByLabelText(/email/i), "bala@test.com");

  const passwords = screen.getAllByLabelText(/password/i);

  await user.type(passwords[0], "Password123!");
  await user.type(passwords[1], "WrongPassword!");

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  expect(
    await screen.findByText(/passwords must match/i)
  ).toBeInTheDocument();

  expect(mockCreateUser).not.toHaveBeenCalled();
  expect(mockShowSnackbar).not.toHaveBeenCalled();
});

const fillValidSignupForm = async (user: any) => {
  await user.type(screen.getByLabelText(/full name/i), "bala");
  await user.type(screen.getByLabelText(/email/i), "bala@test.com");

  const passwords = screen.getAllByLabelText(/password/i);

  await user.type(passwords[0], "Password123!");
  await user.type(passwords[1], "Password123!");
};

beforeEach(() => {
  vi.resetAllMocks();
});

it("creates user successfully", async () => {
  mockGetUsers.mockResolvedValue([]); // no existing user
  mockCreateUser.mockResolvedValue({});

  renderForm();

  const user = userEvent.setup();

  await fillValidSignupForm(user);

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(mockCreateUser).toHaveBeenCalled();
  });

  expect(mockCreateUser).toHaveBeenCalledWith({
    name: "bala",
    email: "bala@test.com",
    password: "Password123!",
    role: "buyer",
  });

  expect(mockShowSnackbar).toHaveBeenCalledWith(
    "Signup successful",
    "success"
  );
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

it("shows error if user already exists", async () => {
  mockGetUsers.mockResolvedValue([{ id: 1 }]);

  renderForm();

  const user = userEvent.setup();

  await fillValidSignupForm(user);

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(mockGetUsers).toHaveBeenCalled();
  });

  expect(mockCreateUser).not.toHaveBeenCalled();

  expect(mockShowSnackbar).toHaveBeenCalledWith(
    "User already exists",
    "error"
  );
});

it("shows error if signup fails", async () => {
  mockGetUsers.mockResolvedValue([]); // no existing user
  mockCreateUser.mockRejectedValue(new Error("Server error"));

  renderForm();

  const user = userEvent.setup();

  await fillValidSignupForm(user);

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(mockCreateUser).toHaveBeenCalled();
  });

  expect(mockShowSnackbar).toHaveBeenCalledWith(
    "Something went wrong. Please try again.",
    "error"
  );
});