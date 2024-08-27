"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

import TextInput from "../_components/TextInput";
import PrimaryButton from "../_components/PrimaryButton";
import { signIn } from "next-auth/react";
import ErrorInfo from "../_components/ErrorInfo";
import { AuthContext } from "@/utils/AuthContext";

const LoginPage = () => {
  const [name, setName] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [error, setError] = useState<AuthInputError>({});

  const router = useRouter();

  const { setUser } = useContext(AuthContext);

  const checkInputBeforeSubmit = () => {
    setError({});

    const check: AuthInputError = {};

    if (name === "") {
      check.name = "Name is required.";
    }
    if (pass === "") {
      check.pass = "Password is required.";
    }

    if (check.name === undefined && check.pass === undefined) {
      return true;
    } else {
      setError(check);
      return false;
    }
  };

  const submit = async () => {
    if (checkInputBeforeSubmit()) {
      const result = await signIn("credentials", {
        name,
        password: pass,
        redirect: false,
      });

      setUser({ name: name });

      if (result?.error) {
        setError({ server: result.error });
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[300px] space-y-5">
        <p className="text-2xl font-bold">Login</p>
        {error.server && <ErrorInfo error={error.server} />}
        <div className="space-y-2">
          <TextInput
            value={name}
            setValue={setName}
            disable={false}
            label="Name"
            error={error.name}
          />
          <TextInput
            value={pass}
            setValue={setPass}
            disable={false}
            label="Password"
            error={error.pass}
          />
        </div>
        <div className="h-[45px]">
          <PrimaryButton action={submit} text="Continue" disabled={false} />
        </div>
        <p className="text-sm font-light">
          Doesn't have an account?{" "}
          <span
            className="cursor-pointer font-normal hover:underline"
            onClick={() => router.push("/register")}
          >
            Register.
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
