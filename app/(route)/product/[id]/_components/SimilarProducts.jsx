import ProductCard from '@/app/_components/ProductCard'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function SimilarProducts({ category }) {
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      const res = await axios.get(`/api/products?category=${category}`, { limit: 3 });
      setSimilarProducts(res.data);
    };

    fetchSimilarProducts();
  }, [category]);

  return (
    <div className='mt-5 bg-tertiary p-3 lol border-2 border-black'>
      <h2 className="text-2xl font-bold">Products in this category</h2>
      <div className="flex items-center flex-wrap justify-around gap-2 mt-10 mb-10">
        {similarProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default SimilarProducts