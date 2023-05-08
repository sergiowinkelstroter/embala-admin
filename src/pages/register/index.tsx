import { ArrowLeft, Pencil, PlusCircle, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ProductForm } from "@/components/ProductForm";
import { CategoryForm } from "@/components/CategoryForm";
import { toast } from "react-toastify";
import { db, storage } from "@/lib/firebase";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Category } from "@/types/Category";
import { NextSeo } from "next-seo";
import { useCollection } from "react-firebase-hooks/firestore";
import Image from "next/image";
import * as Photos from "../../services/photo";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { deleteObject, ref } from "firebase/storage";
import { formatCurrency } from "@/lib/formatCurrency";
import { DeleteProductModal } from "@/components/DeleteProductModal";

export default function Register() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const router = useRouter();
  const productsRef = collection(db, "products");
  const [products, loading, error] = useCollection(productsRef);
  const categoriesRef = collection(db, "categories");
  const [categories, l, e] = useCollection(categoriesRef);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function cancelProduct(productId: string) {
    const productRef = doc(db, "products", String(productId));

    const imageRef = ref(storage, `images/${productId}`);

    deleteDoc(productRef)
      .then(() => {
        deleteObject(imageRef).then(() => {});
        toast.success("Produto excluido com sucesso!");
      })
      .catch(() => {
        toast.success("Algo de errado aconteceu!");
      });
  }

  function handleEditProduct(id: string) {
    router.push(`/register/${id}`);
  }

  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>,
    productID: string
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      const result = await Photos.insert(file, productID);
      const productRef = doc(db, "products", productID);
      await updateDoc(productRef, {
        image: result,
      });
      setUploading(false);
    }
  };

  function newProduct() {
    toast.success("Produdo cadastrado com sucesso!");

    setOpenProduct(false);
  }

  const categoriesArray = categories?.docs.map((category) => category);

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
            products.docs.map((product) => (
              <div
                key={product.id}
                className="bg-green-base flex flex-col justify-between border-2 border-yellow-base w-48 rounded-lg text-yellow-base p-3 "
              >
                <div className="flex flex-col mb-4 justify-end h-full">
                  {product.data().image ? (
                    <Image
                      src={product.data().image.url}
                      unoptimized
                      alt=""
                      width={150}
                      height={100}
                    />
                  ) : (
                    <form
                      method="POST"
                      onSubmit={(e) => handleFormSubmit(e, product.id)}
                    >
                      <input type="file" name="image" />
                      <input type="submit" value="Enviar" className="" />
                      {uploading && "Enviando..."}
                    </form>
                  )}
                  <h1 className="text-lg">
                    {product.data().name.toUpperCase()}
                  </h1>

                  <span>
                    {formatCurrency(product.data().types[0].price)} -{" "}
                    {formatCurrency(product.data().types[1].price)}
                  </span>
                  <p>Status: {product.data().status}</p>
                </div>
                <div className="flex justify-between">
                  <AlertDialog.Root open={open} onOpenChange={setOpen}>
                    <AlertDialog.Trigger className="bg-yellow-base text-green-base p-2 rounded-md uppercase text-sm border-transparent border-2 hover:bg-transparent hover:border-yellow-base hover:text-yellow-base transition-colors">
                      <Trash size={22} />
                      <DeleteProductModal
                        onDelete={() => cancelProduct(product.id)}
                        productName={product.data().name}
                      />
                    </AlertDialog.Trigger>
                  </AlertDialog.Root>
                  <button
                    className="bg-yellow-base text-green-base p-2 rounded-md border-transparent border-2 hover:bg-transparent hover:border-yellow-base hover:text-yellow-base transition-colors"
                    onClick={() => handleEditProduct(product.id!)}
                  >
                    <Pencil size={22} />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-4">
          <Dialog.Root open={openProduct} onOpenChange={setOpenProduct}>
            <Dialog.Trigger className="bg-yellow-base p-3 w-44 h-12 rounded-lg flex items-center gap-2  border-transparent border-2 hover:border-yellow-base hover:text-yellow-base hover:bg-transparent transition-colors">
              Novo Produto <PlusCircle size={28} />
            </Dialog.Trigger>
            <ProductForm
              onNewProduct={newProduct}
              categories={categoriesArray}
            />
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
