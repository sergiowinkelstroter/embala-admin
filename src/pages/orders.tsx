import { Company } from "@/types/Company";
import { Order } from "@/types/Order";
import { NotePencil } from "@phosphor-icons/react";
import { use, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CompanyModal } from "@/components/CompanyModal";
import { useRouter } from "next/router";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { NextSeo } from "next-seo";
import { Loading } from "@/components/Loading";

export default function Orders() {
  const [company, setCompany] = useState<Company | null>(null);
  const router = useRouter();
  const ordersRef = collection(db, "orders");
  const [order, loading, error] = useCollection(ordersRef);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orders"));
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (typeof Notification !== "undefined") {
            if (Notification.permission === "granted") {
              new Notification("Novo Pedido");
            }
          }
        }
      });
    });
  }, []);

  function handleCompany(company: Company) {
    setCompany(company);
  }

  async function cancelOrder(orderId: string) {
    const docRef = doc(db, "orders", String(orderId));

    deleteDoc(docRef)
      .then(() => {
        toast.success("Pedido entregue com sucesso!");
      })
      .catch(() => {
        toast.success("Algo de errado aconteceu!");
      });
  }

  function SignOut() {
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        toast.error("Algo de errado aconteceu! Tente novamente!");
      });
  }
  const [open, setOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <Dialog.Root>
      <NextSeo title="Embala Brasil Admin | Pedidos" />
      <button
        onClick={SignOut}
        className="absolute right-10 top-10 text-white font-bold hover:text-red-600 transition-colors"
      >
        SAIR
      </button>
      <main className="w-full  flex justify-between p-8 text-gray-50">
        <div className="flex flex-col">
          <h2 className="text-xl mb-4">Pedidos:</h2>
          <div className="flex gap-4 flex-wrap">
            {order &&
              order.docs.map((order, index) => (
                <>
                  <div className=" p-4 rounded-lg bg-yellow-base m-2 flex flex-col justify-between">
                    <h1>
                      Pedido para{" "}
                      <Dialog.Trigger
                        onClick={() => handleCompany(order.data().company)}
                        className="underline hover:opacity-60 transition-opacity"
                      >
                        {order.data().company === null
                          ? "N/A"
                          : order.data().company.name}
                      </Dialog.Trigger>
                    </h1>
                    <p className="my-2">
                      Meio de pagamento: {order.data().methodPayment}
                    </p>
                    <AlertDialog.Root open={open} onOpenChange={setOpen}>
                      Produtos:
                      {order.data().products.map((product: any) => {
                        return (
                          <div
                            key={product.type}
                            className="flex flex-col mt-3 w-56 max-h-24"
                          >
                            <span className="text-sm">
                              {product.quantity}x {product.type.toUpperCase()}{" "}
                              de {""}
                              {product.product.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                      <AlertDialog.Trigger className="bg-green-base rounded-md p-1 mt-6  border border-transparent  hover:border-white">
                        Pedido entregue
                        <AlertDialog.Portal>
                          <AlertDialog.Overlay className="bg-black/60 inset-0 fixed" />
                          <AlertDialog.Content className="fixed bg-green-base  py-6  px-5 md:px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg  w-[250px] md:w-[380px] shadow-lg shadow-black/25 my-4">
                            <AlertDialog.Title>
                              Deseja confirmar que o pedido foi entregue para{" "}
                              {order.data().company === null
                                ? "N/A"
                                : order.data().company.name}
                              ?
                            </AlertDialog.Title>
                            <div className="flex gap-2 justify-between mt-4">
                              <AlertDialog.Cancel
                                asChild
                                className=" p-2 rounded-md "
                              >
                                <button>Cancelar</button>
                              </AlertDialog.Cancel>
                              <AlertDialog.Action
                                onClick={() => cancelOrder(order.id)}
                                className="bg-yellow-base p-2 rounded-md border-2 hover:bg-transparent hover:transition-colors"
                              >
                                Confirmar
                              </AlertDialog.Action>
                            </div>
                          </AlertDialog.Content>
                        </AlertDialog.Portal>
                      </AlertDialog.Trigger>
                    </AlertDialog.Root>
                  </div>
                </>
              ))}
          </div>
        </div>
        <button
          className="w-0 h-0 pr-8 hover:opacity-40 transition-opacity"
          onClick={() => router.push("/register")}
        >
          <NotePencil size={32} />
        </button>
      </main>
      {company && <CompanyModal company={company} />}
    </Dialog.Root>
  );
}
