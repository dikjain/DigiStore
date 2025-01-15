import React from 'react'
import Hero from './_components/Hero'
import ProductList from './_components/ProductList'
import Spline from '@splinetool/react-spline/next';

function Home() {
  return (
    <div className='relative'>
      <div className='absolute top-0 left-0 w-full h-full  z-[-1] bg-secondary'>
        <div className='hidden max-[500px]:block'>
          <Spline scene="https://prod.spline.design/KeVJW5pVNCQqhdnJ/scene.splinecode" />
        </div>
        <div className='hidden min-[501px]:block min-[801px]:hidden'>
          <Spline scene="https://prod.spline.design/it8qTJbBFOISljMe/scene.splinecode" />
        </div>
        <div className='hidden min-[801px]:block '>
          <Spline scene="https://prod.spline.design/WM3SVaZhwQ1fD35t/scene.splinecode" />
        </div>
      </div>
      <Hero/>

      <div className='p-10 max-[600px]:px-5 px-28 md:px-36 lg:px-48 bg-tertiary' >
        <ProductList/>
      </div>
    </div>
  )
}

export default Home