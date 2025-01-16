"use client"
import React, { useEffect } from 'react'
import Header from './_components/Header'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { CartProvider, useCart } from './_context/cartContext'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function Provider({children}) {
  const {user} = useUser()

  const CheckIsNewUser = async()=>{
     await axios.post('/api/user', { user });
  }

  useEffect(()=>{
    user && CheckIsNewUser()
    console.log(user)
  },[user])

  return (
    <CartProvider>
      <PayPalScriptProvider options={{ clientId: "AbQlzdv-heM2xD9gkBV8ecr2F61_4YtTypMbq9V_RmalggvHDicXOKRj61SkRHiJ6Hhmc8yT5We7QkgW" }}>
        <CartInitializer user={user} />
        <div>
          <Header/>
        <div>
          {children}
        </div>
      </div>
      </PayPalScriptProvider>
    </CartProvider>
  )
}

function CartInitializer({ user }) {
  const {cart, setCart, setChecked} = useCart();

  const fetchCart = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) {
      try {
        const res = await axios.get(`/api/cart?email=${email}`);
        setCart(res.data);
        setChecked(true);
      } catch (error) {
        console.error('Error fetching cart:', error); 
      }
    }
  }

  useEffect(() => {
    user && fetchCart()
  }, [user])

  return null;
}

export default Provider