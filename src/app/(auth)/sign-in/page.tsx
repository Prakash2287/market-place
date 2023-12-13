"use client";
import { DefaultIcons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import trpc from "@/trpc/client";
import {
  TschemaValidationForAuthentication,
  schemaValidationForAuthentication,
} from "@/app/validators/account-credential-validator";
import { useRouter, useSearchParams } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("as") === "seller";
  //   we are using this to make the code type safe for using in useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TschemaValidationForAuthentication>({
    resolver: zodResolver(schemaValidationForAuthentication),
  });
  const { mutate, isLoading } = trpc.auth.SignIn.useMutation({
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.refresh();
      if (origin) {
        router.push(`${origin}`);
        return;
      }
      if (isSeller) {
        router.push("/sell");
        return;
      }
      router.push("/");
    },
    onError:()=>{
      toast.error('Please check for proper credentials');
    }
  });
  const onSubmit = ({
    email,
    password,
  }: TschemaValidationForAuthentication) => {
    // react-form-submit ensures that we are using onSubmit function that always received schema of the form
    // TschemaValidationonly
    mutate({ email, password });
  };
  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };
  const continueAsSeller = () => {
    router.push("?as=seller");
  };
  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <DefaultIcons.logo className="h-20 w-20"></DefaultIcons.logo>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "link",
                className: "text-muted-foreground",
              })}
            >
              Don&apos;t have an account? Sign Up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 w-300 h-100 m-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className={cn(
                      {
                        "focus-visible:ring-red-500": errors.email,
                      },
                      "h-4"
                    )}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className={cn(
                      {
                        "focus-visible:ring-red-500": errors.password,
                      },
                      "h-4"
                    )}
                    placeholder="Password****"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button className="flex w-full mt-5">Sign In</Button>
            </form>
            <div className="relative">
              <div
                aria-hidden="true"
                className="inset-0 absolute flex items-center"
              >
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            {isSeller ? (
              <Button onClick={continueAsBuyer}>Continue as buyer</Button>
            ) : (
              <Button onClick={continueAsSeller}>Continue as seller</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
