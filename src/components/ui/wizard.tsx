import * as React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Stepper } from "~/components/ui/stepper";
import { Link } from "@tanstack/react-router";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
  optional?: boolean;
  validate?: () => Promise<boolean> | boolean;
}

interface WizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "autoSave"> {
  steps: WizardStep[];
  defaultStep?: number;
  onComplete?: () => void;
  completeText?: string;
  nextText?: string;
  backText?: string;
  cancelText?: string;
  cancelHref?: string;
  showStepSummary?: boolean;
  autoSave?: boolean;
  description?: string;
}

export function Wizard({
  steps,
  defaultStep = 0,
  onComplete,
  completeText = "Complete",
  nextText = "Next",
  backText = "Back",
  cancelText = "Cancel",
  cancelHref,
  showStepSummary = true,
  autoSave = false,
  className,
  ...props
}: WizardProps) {
  const [activeStep, setActiveStep] = React.useState(defaultStep);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepHistory, setStepHistory] = React.useState<number[]>([defaultStep]);

  const currentStep = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = async () => {
    if (currentStep.validate) {
      try {
        const isValid = await currentStep.validate();
        if (!isValid) return;
      } catch (error) {
        console.error("Validation error:", error);
        return;
      }
    }

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        onComplete?.();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    setStepHistory([...stepHistory, nextStep]);
  };

  const handleBack = () => {
    if (isFirstStep) return;

    const newHistory = [...stepHistory];
    newHistory.pop();
    const previousStep = newHistory[newHistory.length - 1];

    setActiveStep(previousStep);
    setStepHistory(newHistory);
  };

  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
      setStepHistory([...stepHistory.slice(0, stepHistory.indexOf(step) + 1)]);
    }
  };

  return (
    <Card className={cn("w-full overflow-hidden", className)} {...props}>
      <CardHeader className="p-6 border-b">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
          allowClickToNavigate={true}
          showDescriptions={showStepSummary}
        />
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <div className="animate-in fade-in-50 duration-300">
          {currentStep.component}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t flex justify-between">
        <div>
          {cancelHref && (
            <Button variant="outline" asChild>
              <Link to={cancelHref}>{cancelText}</Link>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {backText}
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} type="button">
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Processing...
              </div>
            ) : isLastStep ? (
              completeText
            ) : (
              <>
                {nextText}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
