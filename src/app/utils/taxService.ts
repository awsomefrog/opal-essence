interface TaxLocation {
  state: string;
  zipCode: string;
}

// State tax rates (simplified for example)
const STATE_TAX_RATES: { [key: string]: number } = {
  'OR': 0.00,  // Oregon has no sales tax
  'WA': 0.065, // 6.5%
  'CA': 0.0725, // 7.25%
  'NV': 0.0685, // 6.85%
  'ID': 0.06,   // 6%
  'AZ': 0.056,  // 5.6%
  'UT': 0.0485, // 4.85%
  'CO': 0.029,  // 2.9%
  // Add more states as needed
};

// Additional local tax rates by ZIP code (simplified)
const LOCAL_TAX_RATES: { [key: string]: number } = {
  '97132': 0.00, // Newberg, OR
  '98101': 0.036, // Seattle, WA (3.6% local)
  '90001': 0.0275, // Los Angeles, CA (2.75% local)
  // Add more ZIP codes as needed
};

export async function calculateTax(
  location: TaxLocation,
  subtotal: number
): Promise<{ taxRate: number; taxAmount: number }> {
  // Get state tax rate (default to highest rate if state not found)
  const stateTaxRate = STATE_TAX_RATES[location.state] ?? Math.max(...Object.values(STATE_TAX_RATES));
  
  // Get local tax rate (default to 0 if ZIP code not found)
  const localTaxRate = LOCAL_TAX_RATES[location.zipCode] ?? 0;

  // Combined tax rate
  const totalTaxRate = stateTaxRate + localTaxRate;

  // Calculate tax amount
  const taxAmount = subtotal * totalTaxRate;

  return {
    taxRate: totalTaxRate,
    taxAmount: Number(taxAmount.toFixed(2))
  };
} 