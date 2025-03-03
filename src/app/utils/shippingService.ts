interface ShippingRate {
  method: string;
  rate: number;
  estimatedDays: string;
}

interface Location {
  zipCode: string;
  state: string;
}

// Shipping zones based on distance from Newberg, OR (97132)
const SHIPPING_ZONES = {
  ZONE1: ['OR', 'WA', 'ID'], // Closest states
  ZONE2: ['CA', 'NV', 'MT', 'WY'], // Medium distance
  ZONE3: ['AZ', 'UT', 'NM', 'CO'], // Further
  // Add more zones as needed
};

const BASE_RATES = {
  ground: {
    ZONE1: 15,
    ZONE2: 20,
    ZONE3: 25,
    DEFAULT: 30,
  },
  twoDay: {
    ZONE1: 25,
    ZONE2: 35,
    ZONE3: 45,
    DEFAULT: 50,
  },
  overnight: {
    ZONE1: 45,
    ZONE2: 60,
    ZONE3: 75,
    DEFAULT: 90,
  },
};

const ESTIMATED_DAYS = {
  ground: {
    ZONE1: '2-3',
    ZONE2: '3-5',
    ZONE3: '5-7',
    DEFAULT: '7-10',
  },
  twoDay: {
    ZONE1: '2',
    ZONE2: '2',
    ZONE3: '2',
    DEFAULT: '2',
  },
  overnight: {
    ZONE1: '1',
    ZONE2: '1',
    ZONE3: '1',
    DEFAULT: '1',
  },
};

function getShippingZone(state: string): string {
  if (SHIPPING_ZONES.ZONE1.includes(state)) return 'ZONE1';
  if (SHIPPING_ZONES.ZONE2.includes(state)) return 'ZONE2';
  if (SHIPPING_ZONES.ZONE3.includes(state)) return 'ZONE3';
  return 'DEFAULT';
}

function calculateWeightFactor(totalItems: number): number {
  // Simple weight calculation based on number of items
  return 1 + (Math.floor(totalItems / 5) * 0.1);
}

export async function calculateShippingRates(
  destination: Location,
  totalItems: number,
  orderSubtotal: number
): Promise<ShippingRate[]> {
  const zone = getShippingZone(destination.state);
  const weightFactor = calculateWeightFactor(totalItems);

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 150;
  const isEligibleForFreeShipping = orderSubtotal >= FREE_SHIPPING_THRESHOLD;

  const methods = ['ground', 'twoDay', 'overnight'] as const;
  
  return methods.map(method => {
    const baseRate = BASE_RATES[method][zone];
    const rate = isEligibleForFreeShipping && method === 'ground' 
      ? 0 
      : Math.round(baseRate * weightFactor);

    return {
      method: method === 'ground' 
        ? 'Ground Shipping' 
        : method === 'twoDay'
          ? '2-Day Express'
          : 'Overnight Delivery',
      rate,
      estimatedDays: ESTIMATED_DAYS[method][zone],
    };
  });
} 