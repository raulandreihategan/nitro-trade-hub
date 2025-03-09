
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const CheckoutFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = searchParams.get('id');

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        
        setOrderInfo(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-glossy p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            
            <p className="text-gray-600 mb-4">
              We were unable to process your payment. Your order has been saved, and you can try again.
            </p>
            
            {orderInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderInfo.id}</span></p>
                <p className="text-sm text-gray-600">Amount: <span className="font-medium">${orderInfo.total_amount.toFixed(2)}</span></p>
              </div>
            )}
            
            <p className="text-gray-600 mb-8">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
              <Link to="/checkout">
                <Button>Try Again</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutFailed;
