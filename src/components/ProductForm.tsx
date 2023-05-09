import { X } from "@phosphor-icons/react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Category } from "@/types/Category";
import { toast } from "react-toastify";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuid } from "uuid";

interface ProductFormProps {
  onNewProduct: () => void;
  categories: QueryDocumentSnapshot<DocumentData>[] | undefined;
}

export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  category: string;
  types: [
    { name: string; id: string; price: number },
    { name: string; id: string; price: number }
  ];
}

export function ProductForm({ onNewProduct, categories }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  const [status, setStatus] = useState("");

  async function handleNewProduct(data: ProductFormData) {
    try {
      await addDoc(collection(db, "products"), {
        status: status,
        category: data.category,
        description: data.description,
        name: data.name,
        createdAt: Timestamp.fromDate(new Date()),
        types: [
          { id: uuid(), name: data.types[0].name, price: data.types[0].price },
          { id: uuid(), name: data.types[1].name, price: data.types[1].price },
        ],
      });

      onNewProduct();
      setValue("name", "");
      setValue("description", "");
      setValue("category", "");
      setValue("types.0", { name: "", id: "", price: 0 });
      setValue("types.1", { name: "", id: "", price: 0 });
    } catch (error) {
      toast.error("Não foi possivel cadastrar o produto");
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-green-base  py-5 md:px-6 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[450px] md:w-[880px] shadow-lg shadow-black/25 ">
        <div className="flex justify-between">
          <Dialog.Title className="font-bold text-2xl">
            Novo Produto
          </Dialog.Title>
          <Dialog.Close>
            <X size={22} weight="bold" />
          </Dialog.Close>
        </div>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(handleNewProduct)}
        >
          <div className="flex flex-col mt-4">
            <label>Nome:</label>
            <input
              type="text"
              placeholder="Digite o nome"
              {...register("name", { required: true })}
              className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label>Descrição:</label>
            <textarea
              {...register("description", { required: true })}
              className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
              placeholder="Fale um pouco sobre o produto"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col mt-4">
              <label>Varejo: </label>
              <div className="flex gap-4">
                <div className="flex">
                  <input
                    type="text"
                    {...register("types.0.name", { required: true })}
                    placeholder="Digite um nome..."
                    className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
                  />
                </div>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Digite um preço..."
                    {...register("types.0.price", { required: true })}
                    className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label>Atacado: </label>
              <div className="flex gap-4">
                <div className="flex">
                  <input
                    type="text"
                    {...register("types.1.name")}
                    placeholder="Digite um nome..."
                    className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
                  />
                </div>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Digite um preço..."
                    {...register("types.1.price")}
                    className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex  gap-10 ">
            <div className="flex flex-col mt-4">
              <label>Categoria:</label>
              <select
                id=""
                className="bg-yellow-base p-2 rounded-md w-60 "
                {...register("category", { required: true })}
              >
                {categories?.map((category) => {
                  return (
                    <option value={category.id} key={category.id}>
                      {category.data().name}
                    </option>
                  );
                })}
              </select>
            </div>
            <RadioGroup.Root
              className="flex flex-col mt-4 gap-1 justify-center"
              onValueChange={(data) => setStatus(data)}
            >
              <label>Status:</label>
              <div className="flex gap-6">
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <RadioGroup.Item
                    value="Ativo"
                    className="bg-white w-6 h-6 rounded-full"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-center after:w-3  after:h-3 after:rounded-full after:bg-green-base" />
                  </RadioGroup.Item>
                  <label>Ativo</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <RadioGroup.Item
                    value="Inativo"
                    className="bg-white w-6 h-6 rounded-full"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-center after:w-3  after:h-3 after:rounded-full after:bg-green-base" />
                  </RadioGroup.Item>
                  <label>Inativo</label>
                </div>
              </div>
            </RadioGroup.Root>
          </div>
          <input
            type="submit"
            value="Criar"
            className="bg-yellow-base rounded-md uppercase font-bold mt-4 p-2 hover:opacity-80 hover:cursor-pointer"
          />
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
