"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

import TextInput from "../_components/TextInput";
import PrimaryButton from "../_components/PrimaryButton";
import { api } from "@/utils/trpc";
import ErrorInfo from "../_components/ErrorInfo";
import { signIn } from "next-auth/react";
import { AuthContext } from "@/utils/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [error, setError] = useState<AuthInputError>({});

  const router = useRouter();

  const { setUser } = useContext(AuthContext);

  const register = api.user.register.useMutation({
    onError: (e) => {
      const parsedError = JSON.parse(e.message);
      console.log(parsedError);
      setError(parsedError);
    },
  });

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
      try {
        await register.mutateAsync({ name, password: pass });
        const result = await signIn("credentials", {
          name,
          password: pass,
          redirect: false,
        });

        setUser({ name: name });

        if (!result?.error) {
          router.replace("/");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[300px] space-y-5">
        <p className="text-2xl font-bold">Register</p>
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
          Already have an account?{" "}
          <span
            className="cursor-pointer font-normal hover:underline"
            onClick={() => router.push("/login")}
          >
            Login.
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
