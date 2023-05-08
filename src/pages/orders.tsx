import { OrderCard } from "@/components/OrderCard";
import { Company } from "@/types/Company";
import { Order } from "@/types/Order";
import { NotePencil } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CompanyModal } from "@/components/CompanyModal";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
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
import { NextSeo } from "next-seo";

interface Props {
  data: Order[];
}

export default function Orders({ data }: Props) {
  const [company, setCompany] = useState<Company | null>(null);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>(data);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const q = query(collection(db, "orders"));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        if (window.Notification.permission === "granted") {
          new Notification("Novo pedido!");
        }
      }
    });
  });

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
            {orders &&
              orders.map((order) => (
                <OrderCard
                  order={order}
                  key={order.id}
                  onCompanyVisibile={handleCompany}
                  onOrderDelivered={cancelOrder}
                />
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

async function getAllOrders() {
  const ordersRef = collection(db, "orders");
  const querySnapshot = await getDocs(ordersRef);
  const orders = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return orders;
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getAllOrders();

  return {
    props: {
      data,
    },
    revalidate: 10,
  };
};
