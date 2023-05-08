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
import { Category } from "@/types/Category";
import { NextSeo } from "next-seo";
import { GetServerSideProps } from "next";

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
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const categoriesRef = collection(db, "categories");
  const queryCategorySnapshot = await getDocs(categoriesRef);
  const categories = queryCategorySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const productsRef = collection(db, "products");
  const queryProductSnapshot = await getDocs(productsRef);
  const productsData = queryProductSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      productsData,
      categories,
    },
  };
};
