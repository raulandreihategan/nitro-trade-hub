
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, AlertCircle, ArrowLeft, RefreshCcw, ExternalLink } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CheckoutFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  
  const orderId = searchParams.get('id');
  const errorMessage = searchParams.get('error');

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) {
        toast({
          title: "Error",
          description: "Order ID not found in URL",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .maybeSingle();

        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        if (!data) {
          setError("Order not found in our records");
          return;
        }
        
        setOrderInfo(data);
        
        // If there's an error message in the URL, display it
        if (errorMessage) {
          try {
            // Try to parse it as JSON in case it's a stringified object
            const parsedError = JSON.parse(decodeURIComponent(errorMessage));
            setError(parsedError.error || "Unknown error");
            setErrorDetails(parsedError.details || null);
          } catch (e) {
            // If it's not valid JSON, just use it as a string
            setError(decodeURIComponent(errorMessage));
          }
        }
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, navigate, errorMessage, toast]);

  const handleRetry = () => {
    navigate('/checkout', { 
      state: { 
        bypassEmptyCartCheck: true,
        orderId: orderId 
      } 
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-nitro-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
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
            
            {error ? (
              <div className="mb-4">
                <p className="text-gray-600">
                  We were unable to process your payment due to the following error:
                </p>
                <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100 text-red-700 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-left">
                    <p className="font-medium">{error}</p>
                    {errorDetails && (
                      <p className="mt-1 text-xs text-red-600">{errorDetails}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                We were unable to process your payment. Your order has been saved, and you can try again.
              </p>
            )}
            
            {orderInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderInfo.id}</span></p>
                {orderInfo.total_amount && (
                  <p className="text-sm text-gray-600">Amount: <span className="font-medium">${orderInfo.total_amount.toFixed(2)}</span></p>
                )}
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{formatDate(orderInfo.created_at)}</span></p>
              </div>
            )}
            
            <div className="text-left mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Troubleshooting
              </h3>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Ensure you've entered valid payment information</li>
                <li>Check if your card has sufficient funds</li>
                <li>Some cards may require additional verification steps</li>
                <li>If you continue to experience issues, try using a different payment method</li>
              </ul>
            </div>
            
            <p className="text-gray-600 mb-8">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
              <Button onClick={handleRetry} className="flex items-center">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need help? Contact us at <a href="mailto:support@nitrogames.com" className="text-nitro-600 hover:underline">support@nitrogames.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutFailed;
