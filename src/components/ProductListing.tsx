import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
  product: any | null;
  index: number;
}
const ProductListing = ({ product, index }: ProductListingProps) => {
  const [visible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    // The above is used to perform some kind of delay so that we can have some delay in loading of each individual box
    return () => clearTimeout(timer);
  }, [index]);
  if (!product || !visible) return <ProductPlaceholder />;
  if (visible && product) {
    const label=PRODUCT_CATEGORIES.find(({value})=>
        value===product.category
    )?.label;
    const validURLS=product?.images?.map(({image}:any)=>typeof image==='string'?image:image.url)
    return (
      <Link
        href={`/product/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": visible,
        })}
      >
        <ImageSlider urls={validURLS}/>
        <div className="flex flex-col w-full">
            <h3 className="mt-4 font-medium text-sm text-gray-700">
                {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{label}</p>
            <p className="mt-1 font-medium text-sm text-gray-900">{product.price}</p>
        </div>

      </Link>
    );
  }
};
const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3  h-4 rounder-lg" />
      <Skeleton className="mt-2 w-16  h-4 rounder-lg" />
      <Skeleton className="mt-2 w-12  h-4 rounder-lg" />
    </div>
  );
};
export default ProductListing;
