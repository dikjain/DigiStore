"use client"
import React, { useState, useEffect } from 'react'
import { useCart } from '@/app/_context/cartContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import "../../extra.css";
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Loader2Icon, MinusIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PayPalButtons } from '@paypal/react-paypal-js';


function CheckOut() {
  const { cart, total, setCart, checked } = useCart();
  const {user} = useUser();
  const [updateLoading, setUpdateLoading] = useState(null );
  const [loading, setLoading] = useState(false);
 
  useEffect(()=>{
    if(!checked){
    setLoading(true);
  } else{
      setLoading(false);
    }
  },[checked])

  const productMap = cart.reduce((acc, item) => {
    const productId = item[0]?.id;
    if (productId) {
      if (!acc[productId]) {
        acc[productId] = { ...item[0],cartId: item[1], quantity: 1 };
      } else {
        acc[productId].quantity += 1;
      }
    }
    return acc;
  }, {});

  const uniqueProducts = Object.values(productMap);

  const handleDelete = async (id,index) => {
    setUpdateLoading(index);
    try{
      const res = await axios.delete(`/api/cart`, {
        data: { id , email: user?.primaryEmailAddress?.emailAddress }
    });
    setCart(res.data);
    toast.success("Item removed from cart");
    setUpdateLoading(null);
    }catch(error){
      toast.error("Something went wrong");  
    }finally{
      setUpdateLoading(null);
    }
  }

  const addItemToCart = async (productId,index) => {
 
    try{
      setUpdateLoading(index);
      if(user?.primaryEmailAddress?.emailAddress){
        const res = await axios.post('/api/cart', { product: productId, email: user?.primaryEmailAddress?.emailAddress });
        setCart([...cart, res.data]);
        toast.success("Item added to cart");
      }else{
        toast.error("Please login to add to cart");
      }
    }catch(error){
      toast.error("Something went wrong");  
    }finally{
      setUpdateLoading(null);
    }

  }

  return (
    <div>
      <h2 className='text-black font-bold text-2xl mt-10'>CheckOut</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
        <div className='flex flex-col gap-2'>
          {checked && cart.length == 0 && <div className='flex items-center gap-2 mt-20 justify-center'>
            <p className='text-sm font-medium text-gray-500'>No items in cart</p>
          </div>}
          
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-2 items-center lol w-full p-3 justify-center bg-gray-200 animate-pulse">
                  <div className='flex items-center gap-2 w-[30%] justify-center h-fit '>
                    <div className="bg-gray-300 rounded-md w-[100px] h-[100px]"></div>
                  </div>
                  <div className='flex gap-2 w-[70%] justify-between items-center'>
                    <div className="bg-gray-300 rounded-md h-6 w-[120px]"></div>
                    <div className="bg-gray-300 rounded-md h-6 w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            uniqueProducts.map((item, index) => (
              <div key={item.id} className={`flex gap-2 items-center lol w-full border-2 border-black p-3 relative justify-center ${index % 3 === 0 ? 'bg-tertiary' : index % 3 === 1 ? 'bg-secondary' : 'bg-primary'}`}>
                <div className='flex items-center gap-2 w-[30%] justify-center h-fit '>
                  <Link  href={`/product/${item.id}`}>
                    <Image src={item.image} alt={item.title} width={100} height={100} className="lol border-2 border-black" />
                  </Link>
                </div>
                <div className='flex gap-2 w-[70%] justify-between items-center'>
                <div>
                  <Link href={`/product/${item.id}`}>
                  <p className="text-lg font-medium  break-words text-wrap text-white hover:text-white/80 iio">{item.title}</p>
                  </Link>
                  <Badge className="text-[10px] font-light  break-words text-wrap bg-white hover:bg-white hover:text-black">{item.category}</Badge>
                </div>
                  <p className="text-sm font-semibold w-[80px]">${item.price}</p>
                   {(!updateLoading || (updateLoading&&updateLoading!=(index+1))) && <div className='flex items-center gap-2'>
                    <p onClick={()=>handleDelete(item.cartId,index+1)} className='text-sm font-semibold cursor-pointer'><MinusIcon/></p>
                    <p className='text-sm font-semibold'>{item.quantity}</p>
                    <p onClick={()=>addItemToCart(item.id,index+1)} className='text-sm font-semibold cursor-pointer'><PlusIcon/></p>
                  </div>}
                  {updateLoading == (index+1) && <p className='text-sm w-[80px] flex items-center justify-center font-semibold'><Loader2Icon className='animate-spin'/></p>}
              </div>
                <div className='absolute top-[50%] flex items-center gap-2 translate-y-[-50%] left-[-40px]'>
                  <p className='text-sm font-semibold'>{item.quantity}</p>
                  <p className='text-sm font-semibold'>x</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className='w-full flex flex-col gap-2 lol bg-secondary p-4 border-2 border-black '>
          <div className='flex items-center gap-2 justify-between'>
          <p className='text-2xl font-bold'>Total :</p>
          <p className='text-2xl font-bold'>${total}</p>
        </div>
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-sm font-medium text-gray-500'>Email :</p>
          <p className='text-sm font-medium text-gray-500'>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className='flex items-center  gap-2 justify-between mt-12 border-t-2 border-black pt-4'>
          <p className='text-xl font-medium text-gray-500 text-center w-full'>Your Recipient and Product will be delivered to your Email Address</p>
        </div>
        <div className='flex items-center gap-2 justify-center flex-col  w-full mt-12 border-t-2 border-black p-4'>  
          <p className='text-xl font-medium text-black  w-full underline'>Pay with PayPal</p>
          <div className='w-[80%] my-5 p-4 lol bg-primary border-2 border-black'>
          {total && <PayPalButtons createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: total, currency_code: "USD" } }]
            });
          }} onApprove={ async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
          }}
          onCancel={(data) => {
            console.log(data);
            toast.error("Payment cancelled");
          }}
          onError={(err) => {
            console.log(err);
            toast.error("Payment failed");
          }}
          />}
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}

export default CheckOut