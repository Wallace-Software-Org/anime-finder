import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressBar from "@/app/components/ProgressBar";

describe("ProgressBar", () => {
  it("renders the correct number of segments", () => {
    const { container } = render(
      <ProgressBar step={0} totalSteps={4} onGoToStep={() => {}} />,
    );
    expect(container.querySelectorAll("button")).toHaveLength(4);
  });

  it("calls onGoToStep with correct step when completed segment is clicked", async () => {
    const onGoToStep = vi.fn();
    render(<ProgressBar step={2} totalSteps={4} onGoToStep={onGoToStep} />);
    // seg=1 is clickable when step=2 (seg < step). buttons[0] → seg=1
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(onGoToStep).toHaveBeenCalledWith(1);
  });

  it("does not call onGoToStep for future segments", async () => {
    const onGoToStep = vi.fn();
    render(<ProgressBar step={1} totalSteps={4} onGoToStep={onGoToStep} />);
    // step=1: only seg < 1 is clickable — nothing is. buttons[3] → seg=4, not clickable.
    await userEvent.click(screen.getAllByRole("button")[3]);
    expect(onGoToStep).not.toHaveBeenCalled();
  });
});
