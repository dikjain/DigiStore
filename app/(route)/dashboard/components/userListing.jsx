"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import ProductCard from "@/app/_components/ProductCard";
import { Loader2Icon } from "lucide-react";
import "../../../../app/extra.css"

function userListing() {

  const [listing, setListing] = useState([]);
  const { user } = useUser();
  const [tried, setTried] = useState(false) 
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false);

  const fetchProducts = async()=>{
    setLoading(true)
    try {
      const response = await axios.get(`/api/products?search=${user?.primaryEmailAddress?.emailAddress}`)
      setListing(response.data)
      setTried(true)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(refresh){
      fetchProducts()
      setRefresh(false)
    }
  },[refresh])


  useEffect(()=>{
    user && fetchProducts()
  },[user])

  return (
    <div className='mt-5'>
        <h1 className='text-2xl font-bold flex justify-between items-center'>Listing
          <Link href='/add-product'><Button>+ Add New Product</Button></Link>
        </h1>
        <div className="flex justify-center items-center">
          {(loading || !tried) && <Loader2Icon className="animate-spin mt-28 text-gray-500  font-medium text-2xl"/>}
          {tried && listing?.length ==0 && !loading && <p className=" mt-28 text-center text-gray-500  font-medium text-2xl">No listing found</p>}
        </div>
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[1000px]:grid-cols-3 gap-5 mt-10">
          {listing?.length > 0 && !loading && listing?.map((item,index)=>(
            <ProductCard refresh={refresh} setRefresh={setRefresh} key={item?.id} item={item} index={index} />
          ))}
        </div>
    </div>
  )
}

export default userListing