"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { cva } from "class-variance-authority";
import { useMediaQuery } from "~/hooks/use-media-query";

// Update the stepVariants to match the design requirements
const stepVariants = cva(
  "relative flex items-center justify-center rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
      state: {
        inactive:
          "border-2 border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-600",
        active: "border-0 bg-primary text-primary-foreground shadow-sm",
        completed: "border-0 bg-primary text-primary-foreground shadow-sm",
      },
    },
    defaultVariants: {
      size: "default",
      state: "inactive",
    },
  }
);

const stepIconVariants = cva("transition-all duration-200", {
  variants: {
    size: {
      default: "h-5 w-5",
      sm: "h-4 w-4",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Update the stepLabelVariants to match the design requirements
const stepLabelVariants = cva("font-medium transition-all duration-200", {
  variants: {
    size: {
      default: "text-[16px]",
      sm: "text-[14px]",
      lg: "text-[18px]",
    },
    state: {
      inactive: "text-gray-500",
      active: "text-gray-900 font-semibold",
      completed: "text-gray-900",
    },
  },
  defaultVariants: {
    size: "default",
    state: "inactive",
  },
});

// Update the stepDescriptionVariants to match the design requirements
const stepDescriptionVariants = cva("transition-all duration-200", {
  variants: {
    size: {
      default: "text-[14px]",
      sm: "text-[12px]",
      lg: "text-[14px]",
    },
    state: {
      inactive: "text-gray-400 opacity-60",
      active: "text-gray-500",
      completed: "text-gray-500",
    },
  },
  defaultVariants: {
    size: "default",
    state: "inactive",
  },
});

// Update the stepConnectorVariants to match the design requirements
const stepConnectorVariants = cva("transition-all duration-500 ease-in-out", {
  variants: {
    orientation: {
      horizontal: "h-[2px] rounded-full",
      vertical: "w-[2px] rounded-full",
    },
    state: {
      unfilled: "bg-gray-200",
      filled: "bg-primary",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "unfilled",
  },
});

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    optional?: boolean;
    title?: string;
  }[];
  activeStep: number;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
  onStepClick?: (step: number) => void;
  allowClickToNavigate?: boolean;
  showConnectors?: boolean;
  className?: string;
  showDescriptions?: boolean;
}

const sizes = {
  sm: {
    text: "text-sm",
    icon: "h-4 w-4",
  },
  default: {
    text: "text-base",
    icon: "h-5 w-5",
  },
  lg: {
    text: "text-lg",
    icon: "h-6 w-6",
  },
};

// Update the Stepper component to improve the layout and responsiveness
export function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  size = "default",
  onStepClick,
  allowClickToNavigate = false,
  showConnectors = true,
  showDescriptions = false,
  className,
  ...props
}: StepperProps) {
  // Animation ref for progress bar
  const progressRef = React.useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  // Update progress bar width on active step change
  React.useEffect(() => {
    if (progressRef.current && orientation === "horizontal") {
      const totalSteps = steps.length - 1;
      const progress = totalSteps > 0 ? (activeStep / totalSteps) * 100 : 0;
      progressRef.current.style.width = `${progress}%`;
    }
  }, [activeStep, steps.length, orientation]);

  // Handle step click
  const handleStepClick = (index: number) => {
    if (onStepClick && (allowClickToNavigate || index < activeStep)) {
      onStepClick(index);
    }
  };

  // Determine if we should render in mobile mode
  const shouldUseVertical = isTabletOrMobile || orientation === "vertical";

  return (
    <div
      className={cn(
        "relative font-sans w-full px-4 md:px-8 overflow-x-auto",
        shouldUseVertical ? "w-full" : "w-full",
        className
      )}
      {...props}
    >
      {/* Horizontal progress bar (only for horizontal orientation) */}
      {!shouldUseVertical && showConnectors && (
        <div
          className="absolute top-5 left-0 right-0 h-[2px] mx-auto bg-gray-200 rounded-full"
          aria-hidden="true"
          style={{
            left: `calc(${100 / (steps.length * 2)}% + 5px)`,
            right: `calc(${100 / (steps.length * 2)}% + 5px)`,
            maxWidth: "calc(100% - 40px)",
            margin: "0 auto",
          }}
        >
          <div
            ref={progressRef}
            className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
            style={{ width: "0%" }}
          />
        </div>
      )}

      {/* Steps container */}
      <div
        className={cn(
          "relative flex min-w-max",
          shouldUseVertical
            ? "flex-col items-start space-y-8"
            : "flex-row items-center justify-between"
        )}
      >
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index;
          const isClickable = allowClickToNavigate || index < activeStep;
          const stepState = isCompleted
            ? "completed"
            : isActive
              ? "active"
              : "inactive";

          return (
            <div
              key={step.id}
              className={cn(
                "flex",
                shouldUseVertical
                  ? "flex-row items-center"
                  : "flex-col items-center justify-center",
                isClickable && "cursor-pointer group",
                !shouldUseVertical && "flex-1"
              )}
              style={{
                textAlign: "center",
              }}
              onClick={() => isClickable && handleStepClick(index)}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${step.label}, step ${index + 1} of ${steps.length}${
                isActive ? ", current step" : ""
              }${isCompleted ? ", completed" : ""}`}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleStepClick(index);
                }
              }}
            >
              {/* Step circle with number or check icon */}
              <div
                className={cn(
                  stepVariants({ size, state: stepState }),
                  "shadow-sm mx-auto",
                  isActive && "ring-4 ring-primary/20"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="font-jakarta-medium">
                    {step.icon || index + 1}
                  </span>
                )}
              </div>

              {/* Step label and description */}
              <div className="mt-3 flex flex-col items-center text-center w-full">
                <span
                  className={cn(
                    stepLabelVariants({
                      size,
                      state: stepState,
                    }),
                    "text-center w-full"
                  )}
                >
                  {step.label}
                </span>
                {showDescriptions && step.description && !shouldUseVertical && (
                  <span
                    className={cn(
                      stepDescriptionVariants({
                        size,
                        state: stepState,
                      }),
                      "group-hover:opacity-80 hidden md:block text-center w-full"
                    )}
                  >
                    {step.description}
                  </span>
                )}
              </div>

              {/* Vertical connector line (only for vertical orientation) */}
              {shouldUseVertical &&
                index < steps.length - 1 &&
                showConnectors && (
                  <div
                    className="absolute left-5 top-12 h-[calc(100%-40px)]"
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        stepConnectorVariants({
                          orientation: "vertical",
                          state: index < activeStep ? "filled" : "unfilled",
                        }),
                        "h-full"
                      )}
                    />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
