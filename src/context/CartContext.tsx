import { Children, createContext, ReactNode, useContext, useState, useEffect } from "react";
import { OrderDetailDTO } from "../types/OrderDetailDTO";
import { OrderDTO } from "../types/OrderDTO";
import { useCurrency } from "./CurrencyContext";

interface CartContextType {
    order: OrderDTO,
    addToCart: (item: OrderDetailDTO) => void,
    removeFromCart: (productId: number) => void,
    updateQuantity: (productId: number, qyt: number) => void,
    clearCart: () => void
    setRemark: (remark: string) => void 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { currency } = useCurrency();
    const [order, setOrder] = useState<OrderDTO>(() => {
        const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart):{ orderStatus: 0, orderDetails: [], remarks: "", currency: currency };
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(order));
    }, [order]);
    useEffect(() => {
    setOrder(prev => ({
        ...prev,
        currency: currency
    }));
}, [currency]);

    const setRemark = (remark: string) => {
        setOrder(prev => ({ ...prev, remarks: remark }));
    };
    const addToCart = (item: OrderDetailDTO) => {
        setOrder((prev) => {
            const exist = prev.orderDetails.find(d => d.productId === item.productId);          
            if (exist) {
                return {
                    ...prev,
                    orderDetails: prev.orderDetails.map(d =>
                        d.productId === item.productId ? { ...d, quantity: d.quantity + item.quantity } : d
                    )
                }
            }
            return {
                ...prev,
                orderDetails: [...prev.orderDetails, item]
                
            }
           
        })
    }

    const removeFromCart = (productId: number) => {
        setOrder((prev) => ({
            ...prev,
            orderDetails: prev.orderDetails.filter(d => d.productId !== productId)
        }))
    }

    const updateQuantity = (productId: number, qyt: number) => {
        setOrder((prev) => ({
            ...prev,
            orderDetails: prev.orderDetails.map(d => d.productId=== productId ? { ...d, quantity: qyt } : d)
        }))
    }

    const clearCart = () => setOrder({ orderStatus: 0, orderDetails: [] ,remarks: "", currency:currency});

    return (
        <CartContext.Provider value={{ order, addToCart, removeFromCart, updateQuantity, clearCart, setRemark }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
