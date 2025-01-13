import React from 'react'
import Hero from './_components/Hero'
import ProductList from './_components/ProductList'

 function Home() {
  return (
    <div>
      <Hero/>

      <div className='p-10 max-[600px]:px-5 px-28 md:px-36 lg:px-48 bg-tertiary' >
        <ProductList/>
      </div>
    </div>
  )
}

export default Home