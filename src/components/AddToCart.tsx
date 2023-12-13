"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useCart } from "@/hook/use-cart";
interface addToCartProps {
  product: any;
}
const AddToCart = ({ product }: addToCartProps) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleClick = () => {
    addItem(product);
    const timer = setTimeout(() => {
      setIsSuccess(true);
    }, 2000);
  };
  return (
    <Button size="lg" className="w-full" onClick={() => handleClick()}>
      {isSuccess ? (
        <div className="flex items-center">
          <Check
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-green-500"
          />
          <p>Added to cart</p>
        </div>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
};
export default AddToCart;
