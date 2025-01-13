import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { useCart } from '../_context/cartContext'
import CartList from './CartList'

function Header() {
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const MenuList = [{
        name: 'Home',
        path: '/'
    }, {
        name: 'Dashboard',
        path: '/dashboard'
    }, {
        name: 'Explore',
        path: '/explore'
    }];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='flex p-4 px-10 max-[600px]:px-3 md:px-32 lg:px-48 bg-primary items-center justify-between border-b-2 border-black relative z-50'>
            <Link href='/'><h2 className='text-lg text-white bg-black px-2 py-1 max-[600px]:text-base max-[600px]:font-normal max-[600px]:px-1 max-[600px]:py-0 font-bold'>DiGi Store</h2></Link>

            <div className='hidden max-[500px]:block'>
                <button 
                    onClick={toggleMenu} 
                    className='text-black hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100'
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <ul className={`flex gap-5 max-[600px]:gap-1 items-center justify-around h-[40px] max-[600px]:w-[150px] w-[300px] box-border min-[501px]:flex ${
                isMenuOpen 
                    ? 'max-[500px]:flex max-[500px]:flex-col max-[500px]:absolute max-[500px]:top-full max-[500px]:left-0 max-[500px]:right-0 max-[500px]:bg-primary max-[500px]:w-full max-[500px]:p-4 max-[500px]:h-auto max-[500px]:min-h-[300px] max-[500px]:shadow-lg max-[500px]:border-t-2 max-[500px]:border-black max-[500px]:animate-slideDown max-[500px]:z-50' 
                    : 'max-[500px]:hidden'
            }`}>
                {MenuList.map((item) => (
                    <li 
                        className='hover:border-b-2 px-2 max-[600px]:px-1 py-1 max-[600px]:text-xs max-[600px]:font-normal hover:border-white text-black cursor-pointer font-bold max-[500px]:w-full max-[500px]:text-center max-[500px]:py-3 max-[500px]:hover:bg-gray-100 max-[500px]:transition-colors' 
                        key={item.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Link href={item.path}>{item.name}</Link>
                    </li>
                ))}
                <div className='flex gap-3 items-center   max-[600px]:gap-5 max-[500px]:w-full max-[500px]:mt-4'>
                    <CartList>
                        <div className='relative cursor-pointer hover:opacity-80 transition-opacity'>
                            <ShoppingBag />
                            <span className='absolute -top-2 -right-2 bg-secondary text-black border-2 border-black rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center'>{cart?.length}</span>
                        </div>
                    </CartList>
                    <Link href='/dashboard' className='max-[500px]:w-full'>
                        <Button className='bg-tertiary hover:bg-tertiary/80 max-[500px]:w-full'>Start Selling</Button>
                    </Link>
                    <div className='max-[500px]:mt-2'>
                        <UserButton />
                    </div>
                </div>
            </ul>
        </div>
    )
}

export default Header