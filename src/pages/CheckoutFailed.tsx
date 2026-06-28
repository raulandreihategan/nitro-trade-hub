
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, AlertCircle, ArrowLeft, RefreshCcw, Mail, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const CheckoutFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
            setError(parsedError.error || "Error desconocido");
            setErrorDetails(parsedError.details || null);
          } catch {
            setError(decodeURIComponent(errorMessage));
          }
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || "No se pudieron cargar los detalles del pedido");
      } finally {
        setIsLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, errorMessage]);

  const handleRetry = () => {
    navigate('/checkout', {
      state: { bypassEmptyCartCheck: true, orderId },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Minimal header with just the logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center md:justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/3452d003-b503-4079-8026-b61a6a18b8d7.png"
              alt="Nitrogames Logo"
              className="h-10"
            />
          </Link>
          <Link to="/" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-3xl">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-nitro-600 mb-4" />
              <p className="text-gray-600">Cargando los detalles del pedido...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-500" strokeWidth={2} />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Pago no completado
              </h1>

              <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
                No hemos podido procesar tu pago. Tu pedido ha sido guardado y puedes
                intentarlo de nuevo cuando quieras. Si el problema persiste, contacta con
                nuestro equipo de soporte.
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
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID de pedido</p>
                  <p className="font-mono text-sm text-gray-800">{orderInfo.id}</p>
                  {orderInfo.total_amount && (
                    <p className="text-sm text-gray-600 mt-2">
                      Importe: <span className="font-medium text-gray-900">${Number(orderInfo.total_amount).toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="text-left mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
                <h3 className="font-semibold text-yellow-800 mb-2 text-sm">
                  Posibles soluciones
                </h3>
                <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                  <li>Verifica que los datos de tu tarjeta son correctos</li>
                  <li>Comprueba que tu tarjeta tiene fondos suficientes</li>
                  <li>Algunas tarjetas requieren verificación adicional (3D Secure)</li>
                  <li>Si el problema persiste, prueba con otro método de pago</li>
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-2">
                <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2 flex-wrap">
                  <Mail className="h-4 w-4" />
                  ¿Necesitas ayuda? Escríbenos a{' '}
                  <a href="mailto:info@nitrogames.es" className="text-nitro-600 hover:underline font-medium">
                    info@nitrogames.es
                  </a>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al inicio
                    </Button>
                  </Link>
                  <Button onClick={handleRetry} className="w-full sm:w-auto bg-nitro-600 hover:bg-nitro-700">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reintentar pago
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

export default CheckoutFailed;
