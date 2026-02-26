import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import { UIProvider } from "../../context/UIContext";
import { AuthProvider } from "../../context/AuthContext";
import { MuiThemeProvider } from "../../context/MuiThemeProvider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/error/ErrorFallback";
import { screen } from "@testing-library/react";

const renderForm = () => {
    return render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BrowserRouter>
                <AuthProvider>
                    <MuiThemeProvider>
                        <UIProvider>
                            <RegistrationForm />
                        </UIProvider>
                    </MuiThemeProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

it("renders form without crashing", () => {
    renderForm();
    expect(
        screen.getByText(/registration/i)
    ).toBeInTheDocument();
});

it("shows submit button", () => {
  renderForm();

  const submitButton = screen.getByRole("button", {
    name: /submit/i,
  });

  expect(submitButton).toBeInTheDocument();
});

it("shows reset button", () => {
  renderForm();

  const resetButton = screen.getByRole("button", {
    name: /reset/i,
  });

  expect(resetButton).toBeInTheDocument();
});

// import { vi } from "vitest";

// vi.mock("../../hooks/registrationform/useFormHandlers", () => ({
//   useFormHandlers: () => ({
//     expanded: { 0: true, 1: true },
//     handleAccordionChange: () => vi.fn(),
//     handleToggleAll: vi.fn(),
//     fetchRegistrationData: vi.fn(),
//     handleFormError: vi.fn(),
//     onSubmit: vi.fn(),
//     isEditMode: true,
//     id: "1",
//   }),
// }));

// it("shows edit title in edit mode", () => {
//   renderForm();

//   expect(
//     screen.getByText(/edit registration/i)
//   ).toBeInTheDocument();
// });

it("shows edit title in edit mode", () => {
  renderForm();
  screen.debug();
});