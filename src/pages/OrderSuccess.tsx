import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const OrderSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const stateOrderId = location.state?.orderId;
  const queryOrderId = searchParams.get('id');
  const orderId = stateOrderId || queryOrderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
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

        if (data) {
          setOrderDetails(data);
          if (data.status === 'pending') {
            await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
          }
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
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8">
        <img
          src="/lovable-uploads/3452d003-b503-4079-8026-b61a6a18b8d7.png"
          alt="Nitrogames"
          className="h-10"
        />
      </div>

      <div className="w-full max-w-3xl">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-nitro-600 mb-4" />
            <p className="text-gray-600">Cargando los detalles del pedido...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" strokeWidth={2} />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              ¡Pago realizado con éxito!
            </h1>

            <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Tu pago ha sido procesado correctamente. Enviaremos automáticamente los detalles
              de tu pedido a tu correo electrónico en los próximos minutos. Por favor, revisa
              también la carpeta de Spam — a veces los correos terminan allí.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID de pedido</p>
                <p className="font-mono text-sm text-gray-800">{orderId}</p>
              </div>
            )}

            {orderDetails?.order_items?.length > 0 && (
              <div className="mb-8 text-left">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  Resumen del pedido
                </h2>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {orderDetails.order_items.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-medium text-gray-900">{item.service_title}</p>
                        <p className="text-sm text-gray-500">{item.option_name}</p>
                      </div>
                      <p className="font-semibold text-nitro-600">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6 mt-2">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Si no recibes el correo en 4 horas, contacta con info@nitrogames.es
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
