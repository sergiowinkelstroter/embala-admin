import { Product } from "@/types/Product";
import { ArrowLeft, PlusCircle } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ProductForm } from "@/components/ProductForm";
import { ProductCard } from "@/components/ProductCard";
import { CategoryForm } from "@/components/CategoryForm";
import { toast } from "react-toastify";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Props {
  productsData: Product[];
  categories: Category[];
}

export default function Register({ productsData, categories }: Props) {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(productsData);

  function newProduct() {
    toast.success("Produdo cadastrado com sucesso!");

    setOpenProduct(false);
  }

  return (
    <>
      <NextSeo title="Embala Brasil Admin | Produtos" />
      <div className="p-5 flex justify-between text-white">
        <button
          onClick={() => router.push("/orders")}
          className="hover:text-green-base transition-colors absolute top-10"
        >
          <ArrowLeft size={32} weight="bold" />
        </button>
        <div className="flex gap-4 flex-wrap">
          {products !== undefined &&
            products?.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
        </div>

        <div className="flex flex-col gap-4">
          <Dialog.Root open={openProduct} onOpenChange={setOpenProduct}>
            <Dialog.Trigger className="bg-yellow-base p-3 w-44 h-12 rounded-lg flex items-center gap-2  border-transparent border-2 hover:border-yellow-base hover:text-yellow-base hover:bg-transparent transition-colors">
              Novo Produto <PlusCircle size={28} />
            </Dialog.Trigger>
            <ProductForm onNewProduct={newProduct} categories={categories} />
          </Dialog.Root>
          <Dialog.Root open={openCategory} onOpenChange={setOpenCategory}>
            <Dialog.Trigger className="bg-yellow-base p-3 w-44 h-12 rounded-lg flex items-center gap-2  border-transparent border-2 hover:border-yellow-base hover:text-yellow-base hover:bg-transparent transition-colors">
              Nova Categoria <PlusCircle size={28} />
            </Dialog.Trigger>
            <CategoryForm open={() => setOpenCategory(false)} />
          </Dialog.Root>
        </div>
      </div>
    </>
  );
}

import { GetServerSideProps } from "next";
import { Category } from "@/types/Category";
import { NextSeo } from "next-seo";

async function getAllProducts() {
  const productsRef = collection(db, "products");
  const querySnapshot = await getDocs(productsRef);
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return products;
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

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await getAllCategories();

  const productsData = await getAllProducts();

  return {
    props: {
      productsData,
      categories,
    },
  };
};
