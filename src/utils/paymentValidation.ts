
/**
 * Validates and formats payment data
 */

/**
 * Cleans customer data to ensure no undefined values
 */
export const cleanCustomerData = (customers: Record<string, any>): Record<string, any> => {
  const cleanedCustomers = { ...customers };
  
  // Filter out undefined or null values
  Object.keys(cleanedCustomers).forEach(key => {
    const value = cleanedCustomers[key as keyof typeof cleanedCustomers];
    if (
      value === undefined || 
      value === null ||
      (typeof value === 'object' && value !== null && 
        '_type' in value && (value as any)?._type === 'undefined')
    ) {
      delete cleanedCustomers[key as keyof typeof cleanedCustomers];
    }
  });
  
  return cleanedCustomers;
};

/**
 * Validates country format (3-letter ISO country code)
 */
export const validateCountryFormat = (country: string | undefined): { isValid: boolean; message?: string } => {
  if (!country) return { isValid: true };
  
  const countryValue = country.trim();
  if (!/^[A-Z]{3}$/.test(countryValue)) {
    return { 
      isValid: false, 
      message: `Country format might be invalid: ${countryValue}. The API expects 3-letter ISO country codes.`
    };
  }
  
  return { isValid: true };
};

/**
 * Formats mobile phone number to international format
 */
export const formatPhoneNumber = (mobile: string | undefined): string | undefined => {
  if (!mobile) return undefined;
  
  const phoneNumber = mobile.replace(/\s+/g, '');
  return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
};

/**
 * Generates merchant order ID if not provided
 */
export const generateMerchantOrderId = (): string => {
  return `order-${Date.now()}`;
};
