import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumDemo } from "./PremiumDemo";

describe("PremiumDemo", () => {
  it("updates the report when a different finding is selected", async () => {
    const user = userEvent.setup();
    render(<PremiumDemo />);

    await user.click(screen.getByRole("radio", { name: /card errors are not announced/i }));

    expect(screen.getAllByText("F-021").length).toBeGreaterThan(0);
    expect(screen.getByText("The card error appears visually, but assistive technology receives no status update.")).toBeInTheDocument();
  });

  it("requires a protected copy and a retest before report export", async () => {
    const user = userEvent.setup();
    render(<PremiumDemo />);

    await user.click(screen.getByRole("button", { name: /prepare sample report/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/protect the client copy/i);
    expect(screen.queryByRole("button", { name: /download html report/i })).not.toBeInTheDocument();
  });

  it("prepares an export after the evidence chain is complete", async () => {
    const user = userEvent.setup();
    render(<PremiumDemo />);

    await user.click(screen.getByRole("switch", { name: /protect the client copy/i }));
    await user.click(screen.getByRole("radio", { name: "Fixed" }));
    await user.click(screen.getByRole("button", { name: /prepare sample report/i }));

    expect(screen.getByRole("button", { name: /download html report/i })).toBeInTheDocument();
    expect(screen.getByText(/sample report prepared/i)).toBeInTheDocument();
  });

  it("loads the completed example in one action", async () => {
    const user = userEvent.setup();
    render(<PremiumDemo />);

    await user.click(screen.getByRole("button", { name: /load completed example/i }));

    expect(screen.getByRole("switch", { name: /protect the client copy/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Fixed" })).toBeChecked();
    expect(screen.getByRole("button", { name: /download html report/i })).toBeInTheDocument();
  });
});
