import { Company } from "@/types/Company";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
interface CompanyModalProps {
  company: Company;
}

export function CompanyModal({ company }: CompanyModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-green-base  py-8  px-5 md:px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[350px] md:w-[480px] shadow-lg shadow-black/25 my-4">
        <div className="flex justify-between">
          <Dialog.Title className="text-3xl">{company.name}</Dialog.Title>
          <Dialog.Close>
            <X size={25} weight="bold" />
          </Dialog.Close>
        </div>

        <Dialog.Description className="mt-6 flex flex-col gap-2">
          {company.cnpj && <span>CNPJ: {company.cnpj}</span>}
          {company.registation && (
            <span>Inscrição estadual: {company.registation}</span>
          )}
          <span>
            Endereço: {company.address}, Nº {company.number}
          </span>
          <span>Complemento: {company.complement}</span>
          <span>Bairro: {company.district}</span>
          <span>Cidade: {company.city}</span>
          <span>E-mail: {company.email}</span>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
