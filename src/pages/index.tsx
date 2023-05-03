import { LoginForm } from "@/components/LoginForm";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <NextSeo title="Embala Brasil Admin | Entrar" />
      <div className="flex flex-col  m-auto items-center mt-14">
        <h1 className="text-3xl text-start text-yellow-base font-bold">
          Faça seu Login 👋
        </h1>
        <LoginForm />
      </div>
    </>
  );
}
