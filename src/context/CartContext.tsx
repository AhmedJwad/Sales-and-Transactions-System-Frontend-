import { Children, createContext, ReactNode, useContext, useState, useEffect } from "react";
import { OrderDetailDTO } from "../types/OrderDetailDTO";
import { OrderDTO } from "../types/OrderDTO";

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
    const [order, setOrder] = useState<OrderDTO>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : { OrderStatus: 0, OrderDetails: [],Remarks:"" };
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(order));
    }, [order]);
    const setRemark = (remark: string) => {
        setOrder(prev => ({ ...prev, Remarks: remark }));
    };
    const addToCart = (item: OrderDetailDTO) => {
        setOrder((prev) => {
            const exist = prev.OrderDetails.find(d => d.ProductId === item.ProductId);
            if (exist) {
                return {
                    ...prev,
                    OrderDetails: prev.OrderDetails.map(d =>
                        d.ProductId === item.ProductId ? { ...d, Quantity: d.Quantity + item.Quantity } : d
                    )
                }
            }
            return {
                ...prev,
                OrderDetails: [...prev.OrderDetails, item]
            }
        })
    }

    const removeFromCart = (productId: number) => {
        setOrder((prev) => ({
            ...prev,
            OrderDetails: prev.OrderDetails.filter(d => d.ProductId !== productId)
        }))
    }

    const updateQuantity = (productId: number, qyt: number) => {
        setOrder((prev) => ({
            ...prev,
            OrderDetails: prev.OrderDetails.map(d => d.ProductId === productId ? { ...d, Quantity: qyt } : d)
        }))
    }

    const clearCart = () => setOrder({ OrderStatus: 0, OrderDetails: [] });

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
