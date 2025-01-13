import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
function Hero() {
  return (
    <div className='bg-secondary p-10 max-[500px]:px-10 px-28 lg:px-36 border-b-2 border-black' >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 pt-20'>
            <div>
                <h2 className='text-5xl text-white font-extrabold'>Speed Up your Creative Flow</h2>
                <p className='text-base text-gray-200 mt-5'>Join a growing family of 43,436 designers, creator and makers from around the world.</p>
                <Link href='/explore'><Button className='bg-tertiary hover:bg-tertiary/80 mt-10 px-10 py-5'>Explore</Button></Link>
                <Link href='/dashboard'><Button className='bg-primary hover:bg-primary/80 mt-10 ml-5 px-10 py-5'>Sell</Button></Link>
            </div>
            <div className='flex justify-center items-center'>
                <Image className='scale-x-[-1]' src='https://digistore-tubeguruji.netlify.app/_next/image?url=%2Fpc2.png&w=384&q=75' alt='Hero'  height={300} width={300} />
            </div>

        </div>
    </div>
  )
}

export default Hero