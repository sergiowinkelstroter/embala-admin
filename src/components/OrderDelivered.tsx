import { Order } from "@/types/Order";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface OrderDelivered {
  onOrderDelivered: () => void;
  order: Order;
}

export function OrderDelivered({ onOrderDelivered, order }: OrderDelivered) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="bg-black/60 inset-0 fixed" />
      <AlertDialog.Content className="fixed bg-green-base  py-6  px-5 md:px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[250px] md:w-[380px] shadow-lg shadow-black/25 my-4">
        <AlertDialog.Title>
          Deseja confirmar que o pedido foi entregue para{" "}
          {order.company === null ? "N/A" : order.company.name}?
        </AlertDialog.Title>
        <div className="flex gap-2 justify-between mt-4">
          <AlertDialog.Cancel asChild className=" p-2 rounded-md ">
            <button>Cancelar</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action
            onClick={() => onOrderDelivered()}
            className="bg-yellow-base p-2 rounded-md border-2 hover:bg-transparent hover:transition-colors"
          >
            Confirmar
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
}
