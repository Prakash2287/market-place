"use client";

import trpc from "@/trpc/client";
import { CopySlash, Loader2, XCircle } from "lucide-react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
interface verifyMailProps {
  token: string;
}
const VerifyEmail = ({ token }: verifyMailProps) => {
  // we are going to use trpc to verify if our email is correct or not
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  });
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text muted-foreground text-sm">
          This token is not valid or might be expired.Please try again.
        </p>
      </div>
    );
  }
  if (data?.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground"></div>

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">
          Thank you for verifying your email.
        </p>
        <Link className={buttonVariants({ className: "mt-4" })} href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }
  if(isLoading){
    return (
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='animate-spin h-8 w-8 text-zinc-300' />
          <h3 className='font-semibold text-xl'>
            Verifying...
          </h3>
          <p className='text-muted-foreground text-sm'>
            This won&apos;t take long.
          </p>
        </div>
      )
  }
};
export default VerifyEmail;
