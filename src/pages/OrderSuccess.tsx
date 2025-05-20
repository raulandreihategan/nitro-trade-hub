
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Try to get orderId from both state and URL query parameters
  const stateOrderId = location.state?.orderId;
  const queryOrderId = searchParams.get('id');
  const orderId = stateOrderId || queryOrderId;

  useEffect(() => {
    // Fetch order details if we have an orderId
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setOrderDetails(data);
            console.log('Order details retrieved:', data);
            
            // Update order status to completed if needed
            if (data.status === 'pending') {
              await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', orderId);
            }
          } else {
            console.warn('No order found with ID:', orderId);
            toast({
              title: "Order information not found",
              description: "We couldn't find details for your order. It may still be processing.",
              variant: "default"
            });
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
          toast({
            title: "Error retrieving order",
            description: "There was an issue retrieving your order details.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  // If no orderId found at all, show a useful message instead of redirecting
  if (!orderId && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-glossy p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Purchase!</h1>
              
              <p className="text-gray-600 mb-6">
                Your payment was successful, but we couldn't retrieve your order details.
                If you have any questions, please contact our support team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline">Return to Home</Button>
                </Link>
                <Link to="/services">
                  <Button>Browse More Services</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Show loading state while fetching order details
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-nitro-600 mb-4" />
            <p className="text-gray-600">Loading your order details...</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Default success page (either with order details or generic)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-glossy p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been confirmed and is now being processed.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderId}</span></p>
            </div>
            
            {orderDetails && orderDetails.order_items && orderDetails.order_items.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-left">Order Items:</h2>
                <div className="space-y-2 text-left">
                  {orderDetails.order_items.map((item: any) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">{item.service_title}</p>
                      <p className="text-sm text-gray-600">{item.option_name}</p>
                      <p className="text-sm text-nitro-600">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-gray-600 mb-8">
              You will receive an email confirmation shortly. If you have any questions, please contact our support team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
              <Link to="/services">
                <Button>Browse More Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
