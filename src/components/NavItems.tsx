"use client"

import { useEffect, useRef, useState } from "react"
import { PRODUCT_CATEGORIES } from "@/config";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hook/use-on-click-outside";

const NavItems = () => {
  const [activeIndex,setActiveIndex]=useState<null | number> (null);
  const isAnyOpen=activeIndex!==null;
  const navRef=useRef<HTMLDivElement | null>(null);
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
        if(e.key==='Escape'){
            setActiveIndex(null);
        }
    }
    document.addEventListener("keydown",handler);
    // Writing the cleanup code
    return ()=>{
        document.removeEventListener("keydown",handler);
    }
  })
  useOnClickOutside(navRef,()=>setActiveIndex(null));
  return (
    <div className="flex gap-4 h-full" ref={navRef}>
        {
            PRODUCT_CATEGORIES.map((product,i)=>{
                const handleOpen=()=>{
                    if(i==activeIndex)setActiveIndex(null);
                    else setActiveIndex(i);
                }
                const isOpen=(i===activeIndex);
                return (
                    <NavItem category={product} isOpen={isOpen} isAnyOpen={isAnyOpen} key={product.value} handleOpen={handleOpen}/>
                )
            })
        }
    </div>
  )
}

export default NavItems