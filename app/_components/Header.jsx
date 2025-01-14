import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { useCart } from '../_context/cartContext'
import CartList from './CartList'
import { useUser } from '@clerk/nextjs'

function Header() {
    const { user } = useUser();
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const MenuList = [{
        name: 'Home',
        path: '/'
    }, {
       name: 'Explore',
        path: '/explore'
    }, {
        name: 'Dashboard',
        path: '/dashboard'
    }];

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <div className='flex p-4 px-10 max-[600px]:px-3 md:px-32 lg:px-48 bg-primary items-center justify-between border-b-2 border-black relative z-50'>
            <Link href='/'><h2 className='text-lg text-white bg-black px-2 py-1 max-[600px]:text-base max-[600px]:font-normal max-[600px]:px-1 max-[600px]:py-0 font-bold'>DiGi Store</h2></Link>

            <div className='hidden max-[600px]:block'>
                <button 
                    onClick={toggleMenu} 
                    className='text-black hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100'
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <ul className={`flex gap-5 max-[600px]:gap-3 items-center justify-center h-[40px] w-[300px] box-border ${
                isMenuOpen 
                    ? 'max-[600px]:flex max-[600px]:flex-col max-[600px]:absolute max-[600px]:top-full max-[600px]:left-0 max-[600px]:right-0 max-[600px]:bg-primary max-[600px]:w-full max-[600px]:p-2 max-[600px]:h-auto max-[600px]:min-h-[200px] max-[600px]:shadow-lg z-[10000] relative max-[600px]:border-t-2 max-[600px]:border-black max-[600px]:animate-slideDown' 
                    : 'max-[600px]:hidden'
            }`}>
                {MenuList.map((item) => (
                    <li 
                        className='hover:border-b-2 px-2 py-1 hover:border-white text-black cursor-pointer font-bold max-[600px]:w-full max-[600px]:text-center max-[600px]:py-3 max-[600px]:hover:bg-gray-100 max-[600px]:transition-colors' 
                        key={item.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Link href={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>

            <div className={`flex gap-3 items-center max-[600px]:border-b-2 max-[600px]:border-black justify-end ${isMenuOpen ? 'max-[600px]:flex  max-[600px]:absolute max-[600px]:top-[calc(100%+200px)] max-[600px]:left-0 max-[600px]:right-0 max-[600px]:bg-primary max-[600px]:w-full max-[600px]:p-4 max-[600px]:border-t-2 max-[600px]:border-black' : 'max-[600px]:hidden'}`}>
                <CartList>
                    <div className='relative cursor-pointer hover:opacity-80 transition-opacity'>
                        <ShoppingBag />
                        <span className='absolute -top-2 -right-2 bg-secondary text-black border-2 border-black rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center'>{cart?.length}</span>
                    </div>
                </CartList>
                {user ? (
                    <Link href='/dashboard' className='max-[600px]:w-full'>
                        <Button className='bg-tertiary hover:bg-tertiary/80 max-[600px]:w-full'>Start Selling</Button>
                    </Link>
                ) : (
                    <div className='flex gap-2 items-center w-full mx-3'>
                        <Link href='/sign-in' className='max-[600px]:w-full'>
                            <Button className='bg-tertiary hover:bg-tertiary/80 max-[600px]:w-full'>Sign In</Button>
                        </Link>
                        <Link href='/sign-up' className='max-[600px]:w-full'>
                            <Button className='bg-tertiary hover:bg-tertiary/80 max-[600px]:w-full'>Sign Up</Button>
                        </Link>
                    </div>
                )}
                <div className='max-[600px]:mt-2'>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Header