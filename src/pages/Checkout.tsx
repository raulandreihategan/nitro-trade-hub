import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from '@/services/PaymentService';
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, ChevronRight, ChevronLeft, Info, Loader2, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    state: '',
    zip: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const stateParams = location.state as { bypassEmptyCartCheck?: boolean, orderId?: string } | null;

  // Check if user is signed in
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      // If user exists, prefill email
      if (data.session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: data.session.user.email,
        }));
      }
    };
    
    getCurrentUser();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (items.length === 0 && !(stateParams?.bypassEmptyCartCheck)) {
      navigate('/cart');
    }
  }, [items, navigate, stateParams]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'clientName':
        return value.trim() === '' ? 'Full name is required' : '';
      case 'email':
        return !/^\S+@\S+\.\S+$/.test(value) ? 'Valid email is required' : '';
      case 'phone':
        // Validate international format: must start with + and have at least 6 digits
        return value && !/^\+[0-9]{6,15}$/.test(value.replace(/\s+/g, '')) 
          ? 'Phone should be in international format without spaces (e.g., +34644982327)' 
          : '';
      default:
        return '';
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters except the + sign at the beginning
    let cleaned = phone.replace(/\s+/g, '');
    
    // Ensure it starts with + if it doesn't already
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number: strip spaces in real-time
    if (name === 'phone') {
      // Remove spaces as they type
      const formattedValue = value.replace(/\s+/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Validate the field
    const error = validateField(name, name === 'phone' ? value.replace(/\s+/g, '') : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'clientName' || key === 'email') {
        const error = validateField(key, value.toString());
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
      
      // Validate phone if provided
      if (key === 'phone' && value) {
        const error = validateField(key, value.toString());
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      let orderId = stateParams?.orderId;
      let order;

      // If we don't have an orderId from state, create a new order
      if (!orderId) {
        // First save the order to our database
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id,
            total_amount: totalPrice,
            status: 'pending'
          })
          .select()
          .single();
        
        if (orderError) throw orderError;
        
        order = newOrder;
        orderId = newOrder.id;
        
        // Add order items
        const orderItems = items.map(item => ({
          order_id: orderId,
          service_id: item.service_id,
          service_title: item.service_title,
          option_id: item.option_id,
          option_name: item.option_name,
          price: item.price
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      } else {
        // Get the existing order data
        const { data: existingOrder, error: getOrderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (getOrderError) throw getOrderError;
        order = existingOrder;
      }

      // Format phone number for the API - remove all spaces
      const formattedPhone = formData.phone ? formatPhoneNumber(formData.phone) : undefined;

      console.log('Formatted phone for API:', formattedPhone);

      // Create payment URL with MOTO API
      const paymentResult = await PaymentService.createOrder({
        Orders: {
          terminal_id: 1, // Default terminal ID
          amount: order.total_amount.toString(),
          lang: 2, // English
          merchant_order_description: `Order ${orderId} on Nitrogames`,
        },
        Customers: {
          client_name: formData.clientName,
          mail: formData.email,
          mobile: formattedPhone, // Send formatted phone number without spaces
          country: formData.country || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip: formData.zip || undefined,
          address: formData.address || undefined,
        },
        OrdersApiData: {
          okUrl: `${window.location.origin}/order-success?id=${orderId}`,
          koUrl: `${window.location.origin}/checkout/failed?id=${orderId}`,
          merchant_order_id: orderId.toString(),
        },
      });

      console.log('Payment result:', paymentResult);

      // Update our order with the payment intent
      if (paymentResult && paymentResult.body && paymentResult.body.order) {
        await supabase
          .from('orders')
          .update({
            payment_intent_id: paymentResult.body.order.toString(),
          })
          .eq('id', orderId);
      }

      // Clear the cart
      await clearCart();
      
      // Redirect to payment URL if provided
      if (paymentResult && paymentResult.body && paymentResult.body.pay_url) {
        window.location.href = paymentResult.body.pay_url;
      } else {
        // Redirect to success page if no payment URL is provided
        navigate('/order-success', { state: { orderId } });
        toast({
          title: 'Order created',
          description: 'Your order has been created successfully.',
        });
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      
      // Try to get more detailed error message
      let errorMessage = 'There was an error processing your payment';
      if (error.message) {
        errorMessage = error.message;
        
        // Check for specific API errors
        if (error.message.includes('phoneNumber')) {
          errorMessage = 'Invalid phone number format. Please use international format (e.g., +34644982327)';
          setErrors(prev => ({ ...prev, phone: errorMessage }));
        }
      }
      
      // Try to encode error object in the URL
      let errorUrl = `/checkout/failed?id=${stateParams?.orderId || ''}`;
      
      try {
        const errorObj = {
          error: errorMessage,
          details: "Please try again or contact support"
        };
        errorUrl += `&error=${encodeURIComponent(JSON.stringify(errorObj))}`;
      } catch (e) {
        errorUrl += `&error=${encodeURIComponent(errorMessage)}`;
      }
      
      navigate(errorUrl);
      
      toast({
        title: 'Checkout failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <div className="flex items-center text-sm text-gray-500">
              <button 
                onClick={() => navigate('/cart')}
                className="flex items-center hover:text-nitro-600 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to cart
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-glossy p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={errors.clientName ? "border-red-500" : ""}
                        required
                      />
                      {errors.clientName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.clientName}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={errors.email ? "border-red-500" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+34644982327"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone ? (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.phone}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500 flex items-center">
                        <Info className="h-3 w-3 mr-1 flex-shrink-0" />
                        Must be in international format without spaces (e.g., +34644982327)
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Spain"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Barcelona"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="BCN"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="08014"
                      />
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Carrer Sant Pere d'Abanto 16"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center"
                      disabled={isProcessing || Object.values(errors).some(error => error !== '')}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Payment
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-glossy p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">{item.service_title}</p>
                        <p className="text-gray-600 text-sm">{item.option_name}</p>
                      </div>
                      <p className="text-gray-900 font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-nitro-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-sm flex items-start">
                  <Info className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Your payment information will be processed securely on the payment page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
