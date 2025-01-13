import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [checked, setChecked] = useState(false);
    return <CartContext.Provider value={{ cart, setCart, total, setTotal, checked, setChecked }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

export default CartProvider;