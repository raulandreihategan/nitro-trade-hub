
/**
 * Payment error handling utilities
 */

/**
 * Processes payment errors and provides user-friendly messages
 */
export const handlePaymentError = (error: any): Error => {
  console.error('Payment error:', error);
  
  // Default error
  let errorMessage = 'An error occurred during payment processing';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Handle specific error types
    if (error.message.includes('mobile')) {
      return new Error('Phone must be in international format starting with +');
    }
    
    if (error.message.includes('country')) {
      return new Error('Country format is invalid. Please use a 2-letter ISO country code (e.g., GB for United Kingdom)');
    }
    
    if (error.message.includes('API key')) {
      return new Error('Payment system configuration error: Invalid API key format');
    }
    
    if (error.message.includes('API secret')) {
      return new Error('Payment system configuration error: Invalid API secret format');
    }

    if (error.message.includes('Edge Function')) {
      return new Error('Payment gateway connection error. Please try again or contact support.');
    }
  }
  
  // Extract error message from Supabase function response
  if (error.error && error.error.message) {
    return new Error(error.error.message);
  }
  
  // For FunctionsHttpError specifically
  if (error.name === 'FunctionsHttpError') {
    return new Error('Payment gateway connection error. Please try again or contact support.');
  }
  
  return new Error(errorMessage);
};

