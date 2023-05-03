import { db } from "@/lib/firebase";
import { X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";

interface CategoryForm {
  name: string;
}

interface CategoryFormProps {
  open: () => void;
}

export function CategoryForm({ open }: CategoryFormProps) {
  const { register, handleSubmit } = useForm<CategoryForm>();

  async function handleNewCategory(data: CategoryForm) {
    await addDoc(collection(db, "categories"), {
      name: data.name,
    });

    open();
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-green-base  py-6  px-5 md:px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[350px] md:w-[480px] shadow-lg shadow-black/25 my-4">
        <div className="flex justify-between">
          <Dialog.Title className="font-bold text-2xl">
            Nova Categoria
          </Dialog.Title>
          <Dialog.Close>
            <X size={22} weight="bold" />
          </Dialog.Close>
        </div>
        <form onSubmit={handleSubmit(handleNewCategory)}>
          <div className="flex flex-col mt-4">
            <label>Nome:</label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Digite o nome"
              className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
            />
          </div>
          <input
            type="submit"
            value="Criar"
            className="bg-yellow-base rounded-md w-full uppercase font-bold mt-4 p-2 hover:opacity-80 hover:cursor-pointer"
          />
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
