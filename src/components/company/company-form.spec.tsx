import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CompanyForm } from "@/components/company/company-form";

describe("CompanyForm", () => {
  it("starts on the company step and validates the document by person type", async () => {
    const user = userEvent.setup();

    render(
      <CompanyForm
        mode="create"
        onSubmit={vi.fn()}
        submitLabel="Concluir cadastro"
        submittingLabel="Salvando..."
      />,
    );

    expect(screen.getByText("1 de 4")).toBeInTheDocument();
    expect(screen.getByLabelText("CNPJ")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("Informe o nome da empresa.")).toBeInTheDocument();
  });

  it("allows continuing without a logo on the last step", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <CompanyForm
        mode="create"
        defaultValues={{
          personType: "PJ",
          document: "12.ABC.345/01DE-35",
          name: "Loja Exemplo",
          businessEmail: "contato@loja.com",
          phone: "(75) 99999-9999",
          postalCode: "44001-000",
          street: "Rua das Flores",
          number: "10",
          neighborhood: "Centro",
          city: "Feira de Santana",
          state: "BA",
        }}
        onSubmit={onSubmit}
        submitLabel="Concluir cadastro"
        submittingLabel="Salvando..."
      />,
    );

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(screen.getByText("Você pode continuar sem uma logo.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Concluir cadastro" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not show the logo step when editing company data", async () => {
    const user = userEvent.setup();

    render(
      <CompanyForm
        mode="edit"
        defaultValues={{
          personType: "PJ",
          document: "12.ABC.345/01DE-35",
          name: "Loja Exemplo",
          businessEmail: "contato@loja.com",
          phone: "(75) 99999-9999",
          postalCode: "44001-000",
          street: "Rua das Flores",
          number: "10",
          neighborhood: "Centro",
          city: "Feira de Santana",
          state: "BA",
        }}
        onSubmit={vi.fn()}
        submitLabel="Salvar alterações"
        submittingLabel="Salvando..."
      />,
    );

    expect(screen.getByText("1 de 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("3 de 3")).toBeInTheDocument();
    expect(screen.queryByText("Você pode continuar sem uma logo.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar alterações" })).toBeInTheDocument();
  });
});
