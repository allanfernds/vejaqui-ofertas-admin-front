import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OfferForm } from "@/components/offers/offer-form";

const categories = [{ id: "cat-1", name: "Celulares", slug: "celulares", active: true, createdAt: "", updatedAt: "" }];

describe("OfferForm", () => {
  it("shows required-field messages on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <OfferForm
        categories={categories}
        companyName="Loja Exemplo"
        companyCity="Feira de Santana"
        companyState="BA"
        onSubmit={onSubmit}
        submitLabel="Publicar oferta"
        submittingLabel="Publicando oferta..."
      />,
    );

    await user.click(screen.getByRole("button", { name: "Publicar oferta" }));

    expect(await screen.findByText("Informe o nome do produto.")).toBeInTheDocument();
    expect(screen.getByText("Escolha uma categoria.")).toBeInTheDocument();
    expect(screen.getByText("Informe uma imagem.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows delivery fields only when delivery is enabled", async () => {
    const user = userEvent.setup();

    render(
      <OfferForm
        categories={categories}
        companyName="Loja Exemplo"
        companyCity="Feira de Santana"
        companyState="BA"
        onSubmit={vi.fn()}
        submitLabel="Publicar oferta"
        submittingLabel="Publicando oferta..."
      />,
    );

    expect(screen.queryByLabelText("Valor do frete")).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Sim" })[0]!);

    expect(screen.getByText("O frete é grátis?")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Não" })[1]!);
    expect(screen.getByLabelText("Valor do frete")).toBeInTheDocument();
  });
});
