import { Product } from "@/types/Product";
import { Pencil, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { DeleteProductModal } from "./DeleteProductModal";
import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import * as Photos from "../services/photo";
import { deleteObject, ref } from "firebase/storage";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function cancelProduct() {
    const productRef = doc(db, "products", String(product.id));

    const imageRef = ref(storage, `images/${product.id}`);

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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      const result = await Photos.insert(file, product.id!);
      const productRef = doc(db, "products", product.id!);
      await updateDoc(productRef, {
        image: result,
      });
      setUploading(false);
    }
  };

  return (
    <div className="bg-green-base flex flex-col justify-between border-2 border-yellow-base w-48 rounded-lg text-yellow-base p-3 ">
      <div className="flex flex-col mb-4 justify-end h-full">
        {product.image ? (
          <Image
            src={product.image.url}
            unoptimized
            alt=""
            width={150}
            height={100}
          />
        ) : (
          <form method="POST" onSubmit={handleFormSubmit}>
            <input type="file" name="image" />
            <input type="submit" value="Enviar" className="" />
            {uploading && "Enviando..."}
          </form>
        )}
        <h1 className="text-lg">{product.name.toUpperCase()}</h1>

        <span>
          {formatCurrency(product.types[0].price)} -{" "}
          {formatCurrency(product.types[1].price)}
        </span>
        <p>Status: {product.status}</p>
      </div>
      <div className="flex justify-between">
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger className="bg-yellow-base text-green-base p-2 rounded-md uppercase text-sm border-transparent border-2 hover:bg-transparent hover:border-yellow-base hover:text-yellow-base transition-colors">
            <Trash size={22} />
            <DeleteProductModal onDelete={cancelProduct} product={product} />
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
  );
}
