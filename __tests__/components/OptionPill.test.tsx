import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OptionPill from "@/app/components/OptionPill";

describe("OptionPill", () => {
  it("renders the label", () => {
    render(
      <OptionPill emoji="🔥" label="Intense" selected={false} onClick={() => {}} />,
    );
    expect(screen.getByText("Intense")).toBeInTheDocument();
  });

  it("renders the emoji", () => {
    render(
      <OptionPill emoji="🔥" label="Intense" selected={false} onClick={() => {}} />,
    );
    expect(screen.getByText("🔥")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <OptionPill emoji="🔥" label="Intense" selected={false} onClick={onClick} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies selected styling when selected is true", () => {
    const { container } = render(
      <OptionPill emoji="🔥" label="Intense" selected={true} onClick={() => {}} />,
    );
    expect(container.querySelector("button")?.className).toContain("bg-accent-dim");
  });
});
