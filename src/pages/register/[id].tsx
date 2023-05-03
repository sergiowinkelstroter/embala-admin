import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { Category } from "@/types/Category";
import { useEffect, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Product } from "@/types/Product";
import { toast } from "react-toastify";
import { ProductFormData } from "@/components/ProductForm";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GetServerSideProps } from "next";
import { Loading } from "@/components/Loading";

interface Props {
  categories: Category[];
  product: Product;
  id: string;
}

export default function EditProduct({ categories, product, id }: Props) {
  const { push, isFallback } = useRouter();
  const [status, setStatus] = useState("Ativo");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({});

  async function editProduct(data: ProductFormData) {
    const product = {
      status: status,
      ...data,
    };

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, product);

    await push("/register");
    toast.success("Produto editado com sucesso");
  }

  if (isFallback) {
    return <Loading />;
  }

  return (
    <div className="p-5 text-white">
      <button
        onClick={() => push("/register")}
        className="hover:text-green-base transition-colors absolute top-10"
      >
        <ArrowLeft size={32} weight="bold" />
      </button>
      <form
        className="w-1/3 m-auto text-white"
        onSubmit={handleSubmit(editProduct)}
      >
        <div className="flex flex-col mt-4">
          <label>Nome:</label>
          <input
            type="text"
            defaultValue={product?.name}
            placeholder="Digite o nome"
            {...register("name", { required: true })}
            className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label>Descrição:</label>
          <textarea
            defaultValue={product?.description}
            {...register("description", { required: true })}
            className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
            placeholder="Fale um pouco sobre o produto"
          />
        </div>

        <div className="flex flex-col mt-4">
          <label>Varejo: </label>
          <div className="flex gap-8">
            <div className="flex">
              <input
                type="text"
                defaultValue={product?.types[0].name}
                {...register("types.0.name", { required: true })}
                placeholder="Digite um nome..."
                className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
              />
            </div>
            <div className="flex">
              <input
                type="number"
                defaultValue={product?.types[0].price}
                placeholder="Digite um preço..."
                {...register("types.0.price", { required: true })}
                className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label>Atacado: </label>
          <div className="flex gap-8">
            <div className="flex">
              <input
                type="text"
                {...register("types.1.name", { required: true })}
                defaultValue={product?.types[1].name}
                placeholder="Digite um nome..."
                className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
              />
            </div>
            <div className="flex">
              <input
                type="number"
                placeholder="Digite um preço..."
                defaultValue={product?.types[1].price}
                {...register("types.1.price", { required: true })}
                className="rounded-md bg-yellow-base p-2 placeholder:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex  gap-10 ">
          <div className="flex flex-col mt-4">
            <label>Categoria:</label>
            <select
              id=""
              defaultValue={product?.category}
              className="bg-yellow-base p-2 rounded-md"
              {...register("category", { required: true })}
            >
              {categories?.map((category) => {
                return (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>

          <RadioGroup.Root
            className="flex flex-col mt-4 gap-1 justify-center"
            onValueChange={(data) => setStatus(data)}
            defaultValue={product?.status}
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
          value="Editar"
          className="bg-yellow-base rounded-md uppercase font-bold mt-4 p-2 w-full hover:opacity-80 hover:cursor-pointer"
        />
      </form>
    </div>
  );
}

async function getAllCategories() {
  const categoriesRef = collection(db, "categories");
  const querySnapshot = await getDocs(categoriesRef);
  const categories = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return categories;
}

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ params }) => {
  const id = params?.id;

  const docRef = doc(db, "products", String(id));
  const docSnap = await getDoc(docRef);

  let product;

  if (docSnap.exists()) {
    product = docSnap.data();
  } else {
    console.log("No such document!");
  }
  const categories = await getAllCategories();

  return {
    props: {
      product,
      categories,
      id,
    },
  };
};
