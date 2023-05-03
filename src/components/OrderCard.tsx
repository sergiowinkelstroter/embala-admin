import { Order } from "@/types/Order";
import * as Dialog from "@radix-ui/react-dialog";
import { Company } from "@/types/Company";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { OrderDelivered } from "./OrderDelivered";
import { useState } from "react";
import { DocumentData } from "firebase/firestore";

interface OrderCardProps {
  order: Order;
  onCompanyVisibile: (company: Company) => void;
  onOrderDelivered: (orderId: string) => void;
}

export function OrderCard({
  order,
  onCompanyVisibile,
  onOrderDelivered,
}: OrderCardProps) {
  const [open, setOpen] = useState(false);

  function handleCompanyModal() {
    onCompanyVisibile(order.company);
  }

  function handleOrderDelivered() {
    onOrderDelivered(order.id);
  }

  if (order.company === null) {
    handleOrderDelivered();
  }

  return (
    <>
      {order && (
        <div className=" p-4 rounded-lg bg-yellow-base m-2 flex flex-col justify-between">
          <h1>
            Pedido para{" "}
            <Dialog.Trigger
              onClick={handleCompanyModal}
              className="underline hover:opacity-60 transition-opacity"
            >
              {order.company === null ? "N/A" : order.company.name}
            </Dialog.Trigger>
          </h1>
          <p className="my-2">Meio de pagamento: {order.methodPayment}</p>
          <AlertDialog.Root open={open} onOpenChange={setOpen}>
            Produtos:
            {order.products.map((product) => {
              return (
                <div
                  key={product.type}
                  className="flex flex-col mt-3 w-56 max-h-24"
                >
                  <span className="text-sm">
                    {product.quatity}x {product.type.toUpperCase()} de {""}
                    {product.product.toUpperCase()}
                  </span>
                </div>
              );
            })}
            <AlertDialog.Trigger className="bg-green-base rounded-md p-1 mt-6  border border-transparent  hover:border-white">
              Pedido entregue
              <OrderDelivered
                order={order}
                onOrderDelivered={handleOrderDelivered}
              />
            </AlertDialog.Trigger>
          </AlertDialog.Root>
        </div>
      )}
    </>
  );
}
