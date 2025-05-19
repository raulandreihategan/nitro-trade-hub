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
import CountrySelect from '@/components/CountrySelect';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { 
  supportedCurrencies, 
  convertCurrency, 
  formatCurrency,
  exchangeRates
} from "@/utils/currencyConverter";

const Checkout = () => {
  const {
    items,
    totalPrice,
    clearCart
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '+44',
    country: 'GB',
    city: 'London',
    state: 'LDN',
    zip: '12345',
    address: '123 Payment Street',
    taxId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const stateParams = location.state as {
    bypassEmptyCartCheck?: boolean;
    orderId?: string;
  } | null;

  // Calculate price in selected currency
  const convertedTotalPrice = convertCurrency(totalPrice, 'USD', selectedCurrency);
  const formattedPrice = formatCurrency(convertedTotalPrice, selectedCurrency);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      if (data.session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: data.session.user.email
        }));
      }
    };
    getCurrentUser();
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'clientName':
        return value.trim() === '' ? 'Full name is required' : '';
      case 'email':
        return !/^\S+@\S+\.\S+$/.test(value) ? 'Valid email is required' : '';
      case 'phone':
        return !/^\+[0-9]{6,15}$/.test(value.replace(/\s+/g, '')) ? 'Phone must be in international format starting with +' : '';
      case 'country':
        return value.trim() === '' ? 'Country is required' : '';
      case 'taxId':
        return '';
      default:
        return '';
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (generalError) setGeneralError(null);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCountryChange = (value: string) => {
    if (generalError) setGeneralError(null);
    
    setFormData(prev => ({
      ...prev,
      country: value
    }));
    setErrors(prev => ({
      ...prev,
      country: value.trim() === '' ? 'Country is required' : ''
    }));
  };

  const handleCurrencyChange = (value: string) => {
    if (generalError) setGeneralError(null);
    setSelectedCurrency(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Full name is required';
      isValid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!formData.phone || !/^\+[0-9]{6,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Phone must be in international format starting with +';
      isValid = false;
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      let orderId = stateParams?.orderId;
      let order;
      
      if (!orderId) {
        const {
          data: newOrder,
          error: orderError
        } = await supabase.from('orders').insert({
          user_id: user?.id,
          total_amount: totalPrice,
          status: 'pending',
          currency: selectedCurrency !== 'USD' ? selectedCurrency : undefined,
          original_amount: selectedCurrency !== 'USD' ? convertedTotalPrice : undefined
        }).select().single();
        if (orderError) throw orderError;
        order = newOrder;
        orderId = newOrder.id;
        const orderItems = items.map(item => ({
          order_id: orderId,
          service_id: item.service_id,
          service_title: item.service_title,
          option_id: item.option_id,
          option_name: item.option_name,
          price: item.price
        }));
        const {
          error: itemsError
        } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;
      } else {
        const {
          data: existingOrder,
          error: getOrderError
        } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (getOrderError) throw getOrderError;
        order = existingOrder;
      }
      
      const formattedPhone = formatPhoneNumber(formData.phone);

      let orderDescription = `Order ${orderId}`;
      if (items.length > 0) {
        const itemDescriptions = items.map(item => `${item.service_title} (${item.option_name})`);
        orderDescription = `Purchase of: ${itemDescriptions.join(', ')}`;
      }

      // Add currency information to order description if not USD
      if (selectedCurrency !== 'USD') {
        orderDescription += ` (Original: ${formatCurrency(convertedTotalPrice, selectedCurrency)})`;
      }

      const result = await PaymentService.createOrder({
        Orders: {
          terminal_id: 1439,
          amount: selectedCurrency !== 'USD' 
            ? convertCurrency(convertedTotalPrice, selectedCurrency, 'USD').toString()
            : order.total_amount.toString(),
          lang: 2,
          merchant_order_description: orderDescription,
          currency: selectedCurrency // Add currency information
        },
        Customers: {
          client_name: formData.clientName,
          mail: formData.email,
          mobile: formattedPhone,
          tax_id: formData.taxId || undefined,
          country: formData.country,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip: formData.zip || undefined,
          address: formData.address || undefined
        },
        OrdersApiData: {
          okUrl: `${window.location.origin}/order-success?id=${orderId}`,
          koUrl: `${window.location.origin}/checkout/failed?id=${orderId}`,
          merchant_order_id: orderId.toString(),
          incrementId: orderId.toString()
        }
      });
      
      console.log('Payment result:', result);

      if (!result.success && result.error) {
        const errorMessage = result.error.message;
        
        if (errorMessage.includes('Phone must be')) {
          setErrors(prev => ({
            ...prev,
            phone: errorMessage
          }));
          toast({
            title: 'Invalid Phone Format',
            description: errorMessage,
            variant: 'destructive'
          });
          return;
        }
        
        if (errorMessage.includes('Country format')) {
          setErrors(prev => ({
            ...prev,
            country: errorMessage
          }));
          toast({
            title: 'Invalid Country Format',
            description: errorMessage,
            variant: 'destructive'
          });
          return;
        }
        
        if (errorMessage.includes('currency')) {
          setErrors(prev => ({
            ...prev,
            currency: errorMessage
          }));
          toast({
            title: 'Currency Error',
            description: errorMessage,
            variant: 'destructive'
          });
          return;
        }
        
        setGeneralError(errorMessage);
        toast({
          title: 'Payment Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return;
      }
      
      if (result.data && result.data.body && result.data.body.order) {
        await supabase.from('orders').update({
          payment_intent_id: result.data.body.order.toString(),
          currency: selectedCurrency,
          original_amount: selectedCurrency !== 'USD' ? convertedTotalPrice : undefined
        }).eq('id', orderId);
      }
      
      await clearCart();

      if (result.paymentUrl) {
        console.log('Redirecting to payment URL:', result.paymentUrl);
        
        // Show the "redirecting to payment" toast notification
        toast({
          title: 'Payment Processing',
          description: 'Redirecting to payment gateway...',
        });
        
        // Short delay to allow the toast to be shown before redirect
        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 1000);
      } else {
        console.warn('No payment URL found, navigating to success page');
        navigate('/order-success', {
          state: { orderId }
        });
        toast({
          title: 'Order created',
          description: 'Your order has been created successfully.'
        });
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      let errorMessage = 'There was an error processing your payment';
      
      if (error.message) {
        errorMessage = error.message;
        
        if (error.message.includes('mobile') || error.message.includes('phone')) {
          errorMessage = 'Invalid phone number format. Please use international format starting with +';
          setErrors(prev => ({
            ...prev,
            phone: errorMessage
          }));
        }
        
        if (error.message.includes('country')) {
          errorMessage = 'Country format is invalid. Please select a country from the dropdown.';
          setErrors(prev => ({
            ...prev,
            country: errorMessage
          }));
        }

        if (error.message.includes('currency')) {
          errorMessage = 'There was an error with the currency conversion. Please try again or select a different currency.';
        }
      }
      
      setGeneralError(errorMessage);
      
      toast({
        title: 'Checkout failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <div className="flex items-center text-sm text-gray-500">
              <button onClick={() => navigate('/cart')} className="flex items-center hover:text-nitro-600 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to cart
              </button>
            </div>
          </div>
          
          {generalError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {generalError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-glossy p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="John Doe" className={errors.clientName ? "border-red-500" : ""} required />
                      {errors.clientName && <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.clientName}
                        </p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={errors.email ? "border-red-500" : ""} required />
                      {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+44 7911 123456" className={errors.phone ? "border-red-500" : ""} required />
                      {errors.phone ? <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.phone}
                        </p> : <p className="mt-1 text-xs text-gray-500">Phone must be in international format starting with +</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                        Tax ID (Optional)
                      </label>
                      <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} placeholder="Tax ID / VAT Number" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <CountrySelect value={formData.country} onChange={handleCountryChange} placeholder="Select your country" className={errors.country ? "border-red-500" : ""} />
                      {errors.country ? <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.country}
                        </p> : <p className="mt-1 text-xs text-gray-500">
                          Select country using ISO country code (e.g., GB for United Kingdom)
                        </p>}
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="London" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="LDN" />
                      <p className="mt-1 text-xs text-gray-500">Example: LDN</p>
                    </div>
                    
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="SW1A 1AA" />
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <Select 
                        value={selectedCurrency} 
                        onValueChange={handleCurrencyChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedCurrencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} ({currency.symbol}) - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-gray-500">
                        Select your preferred payment currency
                      </p>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="10 Downing Street" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full flex items-center justify-center" disabled={isProcessing || Object.values(errors).some(error => error !== '')}>
                      {isProcessing ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </> : <>
                          Proceed to Payment
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-glossy p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  {items.map(item => <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">{item.service_title}</p>
                        <p className="text-gray-600 text-sm">{item.option_name}</p>
                      </div>
                      <p className="text-gray-900 font-medium">${item.price.toFixed(2)}</p>
                    </div>)}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-nitro-600">
                      {formattedPrice}
                      {selectedCurrency !== 'USD' && (
                        <span className="block text-sm text-gray-500 font-normal">
                          (${totalPrice.toFixed(2)} USD)
                        </span>
                      )}
                    </span>
                  </div>
                  
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Exchange rate: 1 USD = {(1 / (exchangeRates.USD / (exchangeRates[selectedCurrency as keyof typeof exchangeRates] || 1))).toFixed(4)} {selectedCurrency}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-sm flex items-start">
                  <Info className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Your payment information will be processed securely on the payment page.
                    {selectedCurrency !== 'USD' && (
                      <span className="block mt-1">
                        Currency conversion is provided for your convenience. The final charge may vary slightly due to exchange rate fluctuations.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default Checkout;
