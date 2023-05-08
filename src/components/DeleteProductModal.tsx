import { Product } from "@/types/Product";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface DeleteProductModal {
  onDelete: () => void;
  productName: string;
}

export function DeleteProductModal({
  onDelete,
  productName,
}: DeleteProductModal) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="bg-black/60 inset-0 fixed" />
      <AlertDialog.Content className="fixed bg-green-base  py-6  px-5 md:px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[250px] md:w-[380px] shadow-lg shadow-black/25 my-4">
        <AlertDialog.Title>Deseja excluir {productName}?</AlertDialog.Title>
        <div className="flex gap-2 justify-end mt-4">
          <AlertDialog.Cancel asChild className=" p-2 rounded-md">
            <button>Cancelar</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action
            onClick={() => onDelete()}
            className="bg-red-600 p-2 rounded-md"
          >
            Excluir
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
}
