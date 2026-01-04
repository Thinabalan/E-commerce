import { Stepper, Step, StepLabel } from "@mui/material";

interface EcomStepperProps {
  steps: string[];
  activeStep: number;
  stepErrors: boolean[];
  completedSteps: boolean[];
  onStepClick: (step: number) => void;
}

const EcomStepper = ({
  steps,
  activeStep,
  stepErrors,
  completedSteps,
  onStepClick,
}: EcomStepperProps) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step
          key={label}
          completed={completedSteps[index]}
        >
          <StepLabel
            error={stepErrors[index]}
            onClick={() => onStepClick(index)}
            sx={{
              cursor: "pointer",
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default EcomStepper;
