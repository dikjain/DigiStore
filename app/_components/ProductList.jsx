'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchProducts = async()=>{
        try {
            setLoading(true)
            const response = await axios.get(`/api/products?limit=6`)
            setProducts(response.data)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchProducts()
    },[])   

  return (
    <div className='mt-10'>
        <h2 className='text-xl font-bold flex items-center justify-between'>Featured 
            <span ><Button className='bg-primary hover:bg-primary/80'>View All</Button></span>
        </h2>

        <div className='flex justify-center items-center'>
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 mt-5">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-500 h-64 w-full rounded-md"></div>
                    ))}
                </div>
            )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5'>
            {!loading && products?.length > 0 && products.map((product, i) => (
                <div key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProductList