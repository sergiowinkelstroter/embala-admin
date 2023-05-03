import { useState } from "react";
import { Eye, EyeSlash, User } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function SignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push("/orders");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("E-mail ou senha incorreta!");
        setEmail("");
        setPassword("");
      });
  }

  return (
    <div className="flex flex-col gap-6 bg-yellow-base p-6 rounded-md mt-4 w-80 justify-center">
      <label className="flex gap-2 items-center ">
        <input
          type="email"
          className="p-2 rounded-md focus:outline-none w-full"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <User size={28} color="white" />
      </label>
      <label className="flex gap-2 items-center ">
        <input
          type={`${passwordVisible ? "text" : "password"}`}
          className="p-2 rounded-md focus:outline-none w-full"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleVisibility} className="text-white">
          {passwordVisible ? <Eye size={28} /> : <EyeSlash size={28} />}
        </button>
      </label>
      <button
        onClick={SignIn}
        className="bg-green-base rounded-md p-2 text-white font-bold hover:opacity-75 transition-opacity"
      >
        Entrar
      </button>
    </div>
  );
}
