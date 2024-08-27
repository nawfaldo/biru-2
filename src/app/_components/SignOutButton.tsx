"use client";

import { signOut } from "next-auth/react";
import SecondaryButton from "./SecondaryButton";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  return (
    <div className="h-[45px]">
      <SecondaryButton
        text="Signout"
        disabled={false}
        action={async () => await signOut({ callbackUrl: "/login" })}
      />
    </div>
  );
};

export default SignOutButton;
