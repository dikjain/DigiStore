"use client";
import React, {useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "../../../extra.css";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SimilarProducts from "./_components/SimilarProducts";
import { useCart } from "@/app/_context/cartContext";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function ProductPage() {
  const {cart, setCart} = useCart();
  const [product, setProduct] = useState(null);
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [seller, setSeller] = useState(null);
  const { id } = useParams();

  const fetchProduct = async () => {
    const res = await axios.get(`/api/products?id=${id}`);
    setProduct(res.data[0].products);
    setSeller(res.data[0].users);
    console.log(res.data[0].products);
  };

  const addItemToCart = async (productId) => {
    setLoading(true);
    try{
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
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 ">
      <Link href="/explore">
        <h2 className="text-2xl flex items-center gap-2 border-b-2 border-black  w-fit font-bold">
          <ArrowLeftCircle className="text-black" />
          Back
        </h2>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5 min-h-[550px]">
        <Card className="flex  items-center justify-center max-h-[500px] overflow-hidden">
          <Image
            src={product?.image}
            alt={product?.title}
            width={500}
            height={500}
            className="bg-secondary w-full h-[500px] max-h-[500px] lol object-contain"
          />
        </Card>
        <div>
          <h1 className="text-2xl font-bold">{product?.title}</h1>
          <Badge variant="default" className="text-black mt-1">
            {product?.category}
          </Badge>
          <h2 className="text-3xl font-bold text-secondary mt-5 ppo relative">
            ${product?.price}
          </h2>
          <h2 className="text-xl text-gray-400 mt-5">{"Description :"}</h2>
          <h2 className="text-base font-medium mt-1 w-full min-h-[100px] p-2 bg-tertiary lol">
            {product?.description} lorem99
          </h2>
          <Button disabled={loading} className="bg-primary w-full text-white mt-5" onClick={()=>addItemToCart(product?.id)}>
            {loading ? <Loader2 className="animate-spin" /> : "Add to Cart"}
          </Button>
          <Accordion type="single" collapsible className="mt-5">
            <AccordionItem value="item-1" className="bg-secondary">
              <AccordionTrigger>About this product</AccordionTrigger>
              <AccordionContent className="text-white">{product?.details || "No details available"}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-primary">
              <AccordionTrigger>About the Seller</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Image src={seller?.image} alt={seller?.name} width={20} height={20} className="rounded-full" />
                    <h2 className="text-sm text-white">{seller?.name}</h2>
                  </div>
                  <div className="flex items-center">
                    <h2 className="text-[10px] text-gray-600">{seller?.email}</h2>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <SimilarProducts category={product?.category} /> 
    </div>
  );
}

export default ProductPage;
