'use client';

import { useState, useEffect, useCallback } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import Button from '@/components/ui/button';
import type { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CartProps {
  toggle: boolean;
  toggler: (value: boolean) => void;
}

const Cart = ({ toggle, toggler }: CartProps): JSX.Element | null => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      setCart(savedCart ? JSON.parse(savedCart) : []);
      setLoading(false);
    }
  }, [toggle]);

  const subTotal = useCallback((): number => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  }, [cart]);

  const subtTotalWeight = useCallback((): number => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      const itemWeight = (item as CartItem & { size?: number }).size ?? 0;
      return total + item.quantity * itemWeight;
    }, 0);
  }, [cart]);

  const handleClose = (): void => {
    toggler(false);
  };

  const handleCheckout = (): void => {
    window.location.href = '/checkout';
  };

  const handleViewCart = (): void => {
    window.location.href = '/my-cart';
  };

  if (loading) return null;

  return (
    <div
      className={`z-50 bg-white h-screen md:w-1/4 w-full shadow-2xl fixed top-0 transition-all ease-in-out duration-500 overflow-y-auto pb-10 ${
        toggle ? 'right-0' : '-right-full'
      }`}
    >
      {/* Overlay */}
      {toggle && (
        <div
          className="fixed w-full h-full top-0 left-0 -z-10"
          onClick={handleClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && handleClose()}
          aria-label="Close cart"
        />
      )}

      <div className="p-10 z-40 w-full h-screen">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold">Cart</h2>
          <IoCloseOutline
            size="2em"
            onClick={handleClose}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Close cart"
          />
        </div>

        <div className="flex flex-col items-center mt-10">
          {cart.length === 0 ? (
            <span className="font-bold text-zinc-700 py-5">No items in cart</span>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex flex-row flex-1 items-center gap-5 border-b py-5 w-full"
                >
                  <div
                    className="max-w-[80px] max-h-[80px] w-[80px] h-[80px] basis-1/2 border rounded-xl bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: `url('${item.image}')` }}
                    aria-label={item.name}
                  />
                  <div className="flex flex-col justify-between py-2 gap-2">
                    <div className="font-bold">{item.name}</div>
                    <div>
                      Quantity: <span className="font-bold">{item.quantity}</span>
                    </div>
                    <div>
                      Total: <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-row justify-between w-full mt-5 text-lg font-bold">
                <div>Subtotal:</div>
                <div>{formatPrice(subTotal())}</div>
              </div>

              {subtTotalWeight() > 0 && (
                <div className="flex flex-row justify-between w-full mt-5 text-lg font-bold">
                  <div>Approx. Weight:</div>
                  <div>{subtTotalWeight()} g</div>
                </div>
              )}

              <div className="mt-5 w-full">
                <Button
                  text="Checkout"
                  variant="outline"
                  className="w-full mb-3"
                  onClick={handleCheckout}
                />
                <Button
                  text="View Cart"
                  variant="default"
                  className="w-full"
                  onClick={handleViewCart}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
