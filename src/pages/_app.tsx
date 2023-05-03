import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="w-full h-28 bg-yellow-base border-b-2">
        <h1 className="text-4xl text-green-base font-extrabold flex justify-center pt-8 uppercase">
          Embala Brasil
        </h1>
      </header>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
}
