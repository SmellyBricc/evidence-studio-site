import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpecialistReviewForm } from "./SpecialistReviewForm";

describe("SpecialistReviewForm", () => {
  it("shows an actionable error summary when required answers are missing", async () => {
    const user = userEvent.setup();
    render(<SpecialistReviewForm />);

    await user.click(screen.getByRole("button", { name: "Prepare review email" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Finish these questions");
    expect(screen.getByRole("alert")).toHaveTextContent("Choose the price that feels realistic");
  });

  it("prepares an email only after all six questions are answered", async () => {
    const user = userEvent.setup();
    render(<SpecialistReviewForm />);

    await user.click(screen.getByRole("radio", { name: "Independent accessibility specialist" }));
    await user.click(screen.getByRole("radio", { name: "Every week" }));
    await user.click(screen.getByRole("checkbox", { name: "Combining repeated issues" }));
    await user.type(screen.getByRole("textbox", { name: "Current reporting workflow" }), "Spreadsheet and separate screenshots.");
    await user.click(screen.getByRole("radio", { name: "€99 one-time" }));
    await user.type(screen.getByRole("textbox", { name: "Purchase condition" }), "Accessible reports and reliable local backups.");
    await user.click(screen.getByRole("button", { name: "Prepare review email" }));

    expect(screen.getByRole("heading", { name: "Your answers are ready." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open email app" })).toHaveAttribute("href", expect.stringMatching(/^mailto:/));
    expect(screen.getByText("Nothing has been sent. You can open your email app, copy the review, or return to your answers.")).toBeInTheDocument();
  });

  it("removes the error summary after every missing answer is corrected", async () => {
    const user = userEvent.setup();
    render(<SpecialistReviewForm />);

    await user.click(screen.getByRole("button", { name: "Prepare review email" }));
    await user.click(screen.getByRole("radio", { name: "Independent accessibility specialist" }));
    await user.click(screen.getByRole("radio", { name: "Every week" }));
    await user.click(screen.getByRole("checkbox", { name: "Combining repeated issues" }));
    await user.type(screen.getByRole("textbox", { name: "Current reporting workflow" }), "Spreadsheet and separate screenshots.");
    await user.click(screen.getByRole("radio", { name: "€99 one-time" }));
    await user.type(screen.getByRole("textbox", { name: "Purchase condition" }), "Accessible reports and reliable local backups.");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("treats the no-slowdown answer as exclusive", async () => {
    const user = userEvent.setup();
    render(<SpecialistReviewForm />);

    const duplicates = screen.getByRole("checkbox", { name: "Combining repeated issues" });
    const noSlowdown = screen.getByRole("checkbox", { name: "Reporting does not seriously slow me down" });
    await user.click(duplicates);
    await user.click(noSlowdown);

    expect(duplicates).not.toBeChecked();
    expect(noSlowdown).toBeChecked();
  });
});
