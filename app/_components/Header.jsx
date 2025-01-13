import React from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { useCart } from '../_context/cartContext'
import CartList from './CartList'

function Header() {
    const {cart} = useCart();
    const MenuList=[{
        name:'Home',
        path:'/'
    },{
        name:'Dashboard',
        path:'/dashboard'
    },{
        name:'Explore',
        path:'/explore'
    }]
  return (
    <div className='flex p-4 px-10 md:px-32 lg:px-48 bg-primary items-center justify-between border-b-2 border-black'>
        <Link href='/'><h2 className='text-lg text-white bg-black px-2 py-1  font-bold'>DiGi Store</h2></Link>

        <ul className='flex gap-5 items-center justify-around h-[40px] w-[300px] box-border'>
            {MenuList.map((item)=>(
                <li className='hover:border-b-2 px-2 py-1 hover:border-white text-black cursor-pointer font-bold' key={item.path}>
                    <Link href={item.path}>{item.name}</Link>
                </li>
            ))}
        </ul>
        <div className='flex gap-3 items-center'>
            <CartList>
                <div className='relative'>
                    <ShoppingBag/>
                <span className='absolute -top-2 -right-2 bg-secondary text-black border-2 border-black  rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center'>{cart?.length}</span>
            </div>
            </CartList>
            <Link href='/dashboard'><Button className='bg-tertiary hover:bg-tertiary/80'>Start Selling</Button></Link>
            <UserButton />
        </div>
    </div>
  )
}

export default Header