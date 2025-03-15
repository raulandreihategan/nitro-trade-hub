
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, ArrowRight, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { items, removeItem, clearCart, totalPrice, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to complete your purchase.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }
      
      // Navigate to the checkout page instead of checking for empty cart
      navigate('/checkout');
    } catch (error: any) {
      console.error('Error during checkout:', error);
      toast({
        title: 'Checkout failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-glossy p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">You haven't added any items to your cart yet.</p>
              <Link to="/services">
                <Button>Browse Services</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-glossy overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.service_title}</h3>
                            <p className="text-sm text-gray-600">{item.option_name}</p>
                            <p className="mt-1 text-lg font-bold text-nitro-600">${item.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-between items-center">
                    <button
                      onClick={() => clearCart()}
                      className="flex items-center text-gray-600 hover:text-nitro-600 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Clear Cart
                    </button>
                    <Link to="/services" className="text-nitro-600 text-sm hover:underline">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-glossy p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-nitro-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full"
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    {!isCheckingOut && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
