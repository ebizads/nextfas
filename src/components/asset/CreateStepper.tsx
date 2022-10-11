import { useState } from "react";
import { Stepper } from "@mantine/core";
import StepForm from "./StepForm";

type StepType = {
  label: string;
  description: string;
};

const steps = [
  { label: "First Step", description: "Asset Information" },
  { label: "Second Step", description: "General Information" },
  { label: "Third Step", description: "Lease Information" },
  { label: "Third Step", description: "Insurance Information" },
] as StepType[];

const CreateStepper = () => {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < steps.length ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper active={active} iconSize={32} breakpoint="sm">
        {steps.map((step, idx) => (
          <Stepper.Step
            key={idx}
            label={step.label}
            description={step.description}
          >
            <StepForm step={idx + 1} />
          </Stepper.Step>
        ))}
      </Stepper>

      <button onClick={prevStep}>Back</button>
      <button className="bg-tangerine-" onClick={nextStep}>
        Next step
      </button>
    </>
  );
};

export default CreateStepper;
