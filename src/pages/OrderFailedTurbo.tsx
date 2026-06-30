import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { XCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import turbobitLogo from "@/assets/turbobit-logo.svg.asset.json";

const OrderFailedTurbo = () => {
  const [searchParams] = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const orderId = searchParams.get('id');
  const errorMessage = searchParams.get('error');

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .maybeSingle();

        if (error) throw error;
        if (data) setOrderInfo(data);

        if (errorMessage) {
          try {
            const parsedError = JSON.parse(decodeURIComponent(errorMessage));
            setError(parsedError.error || "Unknown error");
            setErrorDetails(parsedError.details || null);
          } catch {
            setError(decodeURIComponent(errorMessage));
          }
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || "Could not load order details");
      } finally {
        setIsLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, errorMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8">
        <img
          src={turbobitLogo.url}
          alt="Turbobit"
          className="h-10"
        />
      </div>

      <div className="w-full max-w-3xl">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500 mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="100-red-500" strokeWidth={2} />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Payment not completed
            </h1>

            <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
              We could not process your payment. Your order has been saved and you can
              try again at any time. If the problem persists, contact our support team.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start text-left">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">{error}</p>
                  {errorDetails && (
                    <p className="mt-1 text-xs text-red-700">{errorDetails}</p>
                  )}
                </div>
              </div>
            )}

            {orderInfo && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                <p className="font-mono text-sm text-gray-800">{orderInfo.id}</p>
                {orderInfo.total_amount && (
                  <p className="text-sm text-gray-600 mt-2">
                    Amount: <span className="font-medium text-gray-900">${Number(orderInfo.total_amount).toFixed(2)}</span>
                  </p>
                )}
              </div>
            )}

            <div className="text-left mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
              <h3 className="font-semibold text-yellow-800 mb-2 text-sm">
                Possible solutions
              </h3>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Verify that your card details are correct</li>
                <li>Check that your card has sufficient funds</li>
                <li>Some cards require additional verification (3D Secure)</li>
                <li>If the problem persists, try another payment method</li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Need help? Write to us at support@turbobit.net
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFailedTurbo;
