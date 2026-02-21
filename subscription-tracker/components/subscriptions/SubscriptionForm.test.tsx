/**
 * SubscriptionForm unit tests
 * @Maya + @Fede — Frontend testing
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubscriptionForm } from "./SubscriptionForm";

const mockCategories = [
  { id: "cat-streaming", name: "Streaming", icon: "🎬" },
  { id: "cat-software", name: "Software", icon: "💻" },
];

describe("SubscriptionForm", () => {
  it("toont fout bij lege naam", async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    const { container } = render(
      <SubscriptionForm
        categories={mockCategories}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/naam is verplicht/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("toont fout bij negatieve prijs", async () => {
    const onSubmit = vi.fn();

    const { container } = render(
      <SubscriptionForm
        categories={mockCategories}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.type(screen.getByLabelText(/naam/i), "Netflix");
    const priceInput = screen.getByLabelText(/prijs/i);
    fireEvent.change(priceInput, { target: { value: "-5" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText(/voer een geldig bedrag in/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("toont fout bij naam langer dan 100 tekens", async () => {
    const onSubmit = vi.fn();
    const longName = "a".repeat(101);

    const { container } = render(
      <SubscriptionForm
        categories={mockCategories}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );

    const nameInput = screen.getByLabelText(/naam/i);
    fireEvent.change(nameInput, { target: { value: longName } });
    await userEvent.type(screen.getByLabelText(/prijs/i), "9.99");
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText(/naam mag max\. 100 tekens zijn/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submittet bij geldige data", async () => {
    const onSubmit = vi.fn();

    const { container } = render(
      <SubscriptionForm
        categories={mockCategories}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.type(screen.getByLabelText(/naam/i), "Netflix");
    await userEvent.type(screen.getByLabelText(/prijs/i), "9.99");
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Netflix",
          price: 9.99,
          currency: "EUR",
          billingCycle: "monthly",
          categoryId: "cat-streaming",
          notes: "",
        })
      );
    });
  });

  it("roept onCancel aan bij Annuleren", async () => {
    const onCancel = vi.fn();

    render(
      <SubscriptionForm
        categories={mockCategories}
        onSubmit={() => {}}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /annuleren/i }));

    expect(onCancel).toHaveBeenCalled();
  });
});
