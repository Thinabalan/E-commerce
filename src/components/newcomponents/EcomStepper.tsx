import { Stepper, Step, StepLabel } from "@mui/material";
import React from "react";

interface EcomStepperProps {
  steps: string[];
  activeStep: number;
  stepErrors?: boolean[];
}

const EcomStepper: React.FC<EcomStepperProps> = ({
  steps,
  activeStep,
  stepErrors = [],
}) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel error={stepErrors[index]}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default EcomStepper;
