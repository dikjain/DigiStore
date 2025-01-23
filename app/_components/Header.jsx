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
        <div className='flex p-4 px-10 max-[700px]:px-3 md:px-32 lg:px-48 bg-primary items-center justify-between border-b-2 border-black relative z-[55]'>
            <Link href='/'><h2 className='text-lg text-white bg-black px-2 py-1 ml-[20px] max-[700px]:font-medium   font-bold'>DiGi Store</h2></Link>

            <div className='hidden max-[700px]:block'>
                <button 
                    onClick={toggleMenu} 
                    className='text-black hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100'
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <ul className={`flex gap-5 max-[700px]:gap-3 items-center  justify-center h-[40px] w-[300px] box-border ${
                isMenuOpen 
                    ? 'max-[700px]:flex max-[700px]:flex-col max-[700px]:absolute max-[700px]:top-full max-[700px]:left-0 max-[700px]:right-0 max-[700px]:bg-primary max-[700px]:w-full max-[700px]:p-2 max-[700px]:h-auto max-[700px]:min-h-[200px] max-[700px]:shadow-lg z-[10000] relative max-[700px]:border-t-2 max-[700px]:border-black max-[700px]:animate-slideDown' 
                    : 'max-[700px]:hidden'
            }`}>
                {MenuList.map((item) => (
                    <Link href={item.path} key={item.path}>
                    <li 
                        className=' min-[701px]:hover:border-b-2 px-2 py-1  min-[701px]:hover:border-white text-black cursor-pointer font-bold max-[700px]:w-screen max-[700px]:text-center max-[700px]:py-3 max-[700px]:hover:bg-gray-100 max-[700px]:transition-colors' 
                        key={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        >
                        <p>{item.name}</p>
                    </li>
                 </Link>
                ))}
            </ul>

            <div className={`flex gap-3 items-center  relative max-[700px]:border-b-2 max-[700px]:border-black justify-end ${isMenuOpen ? 'max-[700px]:flex  max-[700px]:absolute max-[700px]:top-[calc(100%+200px)] max-[700px]:left-0 max-[700px]:right-0 max-[700px]:bg-primary max-[700px]:w-full max-[700px]:p-4 max-[700px]:border-t-2 max-[700px]:border-black' : 'max-[700px]:hidden'}`}>
                <CartList>
                    <div className='relative cursor-pointer hover:opacity-80 transition-opacity'>
                        <ShoppingBag />
                        <span className='absolute -top-2 -right-2 bg-secondary text-black border-2 border-black rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center'>{cart?.length}</span>
                    </div>
                </CartList>
                {user ? (
                    <Link href='/dashboard' className='max-[700px]:w-full'>
                        <Button className='bg-tertiary hover:bg-tertiary/80 max-[700px]:w-full'>Start Selling</Button>
                    </Link>
                ) : (
                    <div className='flex gap-2 items-center w-full mx-3'>
                        <Link href='/sign-in' className='max-[700px]:w-full'>
                            <Button className='bg-tertiary hover:bg-tertiary/80 max-[700px]:w-full'>Sign In</Button>
                        </Link>
                        <Link href='/sign-up' className='max-[700px]:w-full'>
                            <Button className='bg-tertiary hover:bg-tertiary/80 max-[700px]:w-full'>Sign Up</Button>
                        </Link>
                    </div>
                )}
                <div className='max-[700px]:mt-2'>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Header