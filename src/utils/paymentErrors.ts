
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
      return new Error('Phone must be in international format starting with + (e.g., +34644982327)');
    }
    
    if (error.message.includes('country')) {
      return new Error('Country format is invalid. Please use a 3-letter ISO country code (e.g., ESP for Spain)');
    }
    
    if (error.message.includes('API key')) {
      return new Error('Payment system configuration error: Invalid API key format');
    }
    
    if (error.message.includes('API secret')) {
      return new Error('Payment system configuration error: Invalid API secret format');
    }
  }
  
  return new Error(errorMessage);
};
