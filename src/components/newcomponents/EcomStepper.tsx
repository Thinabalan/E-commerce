import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import React from "react";

interface EcomStepperProps {
  steps: string[];
  activeStep: number;
  stepErrors?: boolean[];
  errorText?: string;
}

const EcomStepper: React.FC<EcomStepperProps> = ({
  steps,
  activeStep,
  stepErrors = [],
  errorText = "Required fields missing",
}) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => {
        const isError = stepErrors[index];

        return (
          <Step key={label}>
            <StepLabel
              error={isError}
              optional={
                isError ? (
                  <Typography variant="caption" color="error">
                    {errorText}
                  </Typography>
                ) : null
              }
            >
              {label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default EcomStepper;
