"use client";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "./ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hook/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
const Cart = () => {
  const {items}=useCart();
  const itemsCount=items.length;
  const cartTotal=items.reduce((total,{product})=>total+product.price,0);
  const [isMounted,setIsMounted]=useState<boolean>(false);
  useEffect(()=>{
    setIsMounted(true);
  },[])
  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          className="h-6 w-6 flex-shrink-0 text-gray-500 group-hover:text-gray-700"
          aria-hidden="true"
        />
        <span className="ml-2 text-sm font-medium text-red-400 group-hover:text-red-700">
          {isMounted ? itemsCount: 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0">
        <SheetHeader>Cart {itemsCount}</SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
              {
                items.map((product:any)=>{
                  return(
                    <CartItem key={product.id} product={product}/>
                  )
                })
              }
              </ScrollArea>
            </div>
            <div className="space-y-6 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction cartTotal</span>
                  <span>{cartTotal}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{cartTotal}</span>
                </div>
              </div>
            </div>
            <SheetFooter>
                <SheetTrigger asChild>
                    <Link href='/cart' className={cn("w-full mr-4",buttonVariants(({variant:'default'})))} >
                        Continue To Checkout
                    </Link>
                </SheetTrigger>
            </SheetFooter>
          </>
        ) : (
          <div>
            <SheetFooter className="mt-auto">
                <SheetTrigger className="w-full mr-4">
                    <Button variant='destructive'>
                        Continue Shopping..
                    </Button>
                </SheetTrigger>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default Cart;
