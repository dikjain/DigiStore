import React, { useEffect, useState } from 'react'
import { Card  } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChartLine, Loader2, Pencil, Trash } from 'lucide-react'
import '../extra.css'
import ProductEditableBox from './ProductEditableBox'
import Link from 'next/link'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { useCart } from '../_context/cartContext'
import { toast } from 'sonner'
import DialogWindow from './dialogWindow'
import { useRouter } from 'next/navigation'

function ProductCard({ product, item, index, refresh , setRefresh}) {
  const {user} = useUser();
  const {cart, setCart} = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


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

  const deleteProduct = async (id) => {
    try {
      await axios.delete("/api/products", { data: { id } });
      toast.success("Product deleted");
      setRefresh(true);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  }

  const isExplore = window.location.pathname === '/explore';
  const isHome = window.location.pathname === '/';

  return (
    <Card className={`p-3 ${index % 3 == 0 ? 'bg-secondary' : index % 3 == 1 ? 'bg-tertiary' : 'bg-primary'} ${isHome ? 'lassi' : ''} lol`}>
      <Link href={` /product/${product?.id || item?.id}`}>
        <Image src={product?.image || item?.image} alt={product?.name || item?.title || product?.title || "Product Image"} loading='lazy' height={250} width={300} className='mx-auto lol2 min-h-[250px] max-h-[150px] bg-white object-contain border-2 border-black shadow-md rounded-md' />
      </Link>
      <div className={`mt-3 ${isHome ? 'pusi' : ''} ${item ? `${index % 3 == 0 ? 'bg-primary' : index % 3 == 1 ? 'bg-secondary' : 'bg-tertiary'}  text-center flex ${isHome ? 'pusi' : ''} items-center justify-between p-3 border-2 border-black lol` : ''}`}>
        <Link href={`/product/${product?.id || item?.id}`}><h2 className='text-2xl font-bold line-clamp-1'>{product?.name || item?.title || product?.title}</h2></Link>
        <h2 className={`text-2xl ${isHome ? 'text-white' : ''} ${item ? 'text-white' : isExplore ? 'text-white' : 'text-secondary'} font-bold mt-2`}>${product?.price || item?.price}</h2>
        <div className='min-[500px]:flex items-center gap-2 mt-3 justify-between'>
          {product?.user?.image && <div className='flex items-center gap-2'>
            <Image src={product?.user?.image} alt={product?.user?.name} width={20} height={20} className='rounded-full' />
            <h2 className='text-sm text-gray-600'>{product?.user?.name || item?.user?.name}</h2>
          </div>}
          {item && <ProductEditableBox children={<div className='flex flex-col gap-2'>
            <div className='flex items-center justify-center bg-tertiary lol gap-2 w-full hover:bg-tertiary/80 cursor-pointer text-white p-1 rounded-md'><Pencil className='text-black' />Edit</div>
            <div className='flex items-center justify-center bg-secondary lol gap-2 w-full hover:bg-secondary/80 cursor-pointer text-white p-1 rounded-md'><ChartLine className='text-black' />Analytics</div>
            <DialogWindow  deleteProduct={()=>deleteProduct(product?.id || item?.id)} refresh={refresh}><div className='flex items-center justify-center bg-primary lol gap-2 w-full hover:bg-primary/80 cursor-pointer text-white p-1 rounded-md'><Trash className='text-black' />Delete</div></DialogWindow>
          </div>} >
          </ProductEditableBox>}
          {!item && <Button disabled={loading} onClick={()=>addItemToCart(product?.id)} className={`${index % 3 == 0 ? 'bg-primary hover:bg-primary/80' : index % 3 == 1 ? 'bg-secondary hover:bg-secondary/80' : 'bg-tertiary hover:bg-tertiary/80'}  mb-2 mx-2`}>{loading ? <Loader2 className='animate-spin' /> : "Add to Cart"}</Button>}
        </div>
      </div>
    </Card>
  )
}

export default ProductCard