"use client"
import  { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "../_context/cartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import "../extra.css";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import "../extra.css";

function CartList({children}) {
    const {cart , setCart , total , setTotal} = useCart();
    const {user} = useUser();
    const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (id) => {
    const res = await axios.delete(`/api/cart`, {
        data: { id , email: user?.primaryEmailAddress?.emailAddress }
    });
    setCart(res.data);
    toast.success("Item removed from cart");
  }
  
  const handleTotal = () =>{
    setTotal(cart.reduce((acc,item)=>acc+item[0]?.price,0));
  }

  useEffect(()=>{
    handleTotal();
  },[cart])
  
 
  const handleCheckout = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen} className="z-[102] relative">
        <SheetTrigger asChild>
          <div onClick={() => setIsOpen(true)}>{children}</div>
        </SheetTrigger>
        <SheetContent className="max-[700px]:p-0">
          <SheetHeader>
            <SheetTitle>Cart <span className="text-sm text-gray-500">({cart?.length})</span></SheetTitle>
            <p className="text-lg font-bold text-center">Your Cart List</p>
            <SheetDescription className=" min-[700px]:p-[10px]">
            <div className="flex flex-col gap-2  max-h-[78vh] scrollx overflow-y-auto py-2  px-2">
            {cart?.map((item,index)=>(
                <div key={index} className={`flex gap-2 items-center lol p-2 justify-around ${index%3 === 0 ? 'bg-tertiary' : index%3 === 1 ? 'bg-secondary' : 'bg-primary'}`}>
                    <Image src={item[0]?.image} alt={item[0]?.title} width={100} className="lol border-2 border-black" height={100}/>
                    <div>
                        <p className="text-lg max-[700px]:text-sm font-medium max-[700px]:max-w-[80px] max-w-[120px] truncate">{item[0]?.title}</p>
                        <p className="text-sm max-[700px]:text-xs font-semibold">${item[0]?.price}</p>
                    </div>
                    <Button variant="destructive" onClick={()=>handleDelete(item[1])} className=" max-[700px]:text-xs p-2 max-[700px]:p-1"><Trash2/></Button>
                </div>
            ))}
          </div>
            <div className="flex flex-col gap-2  min-h-[50vh] px-2 ">
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Total :</p>
                <p className="text-lg  font-bold">${total}</p>
            </div>
            <Link href="/check-out">
            <Button className="bg-tertiary hover:bg-tertiary/80" onClick={handleCheckout}>Checkout</Button>
            </Link>
            </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CartList;
