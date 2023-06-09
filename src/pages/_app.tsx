import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="w-full h-28 bg-yellow-base border-b-2">
        <h1 className="text-4xl text-green-base font-extrabold flex justify-center pt-8 uppercase">
          Embala Brasil
        </h1>
      </header>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </>
  );
}
