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
  ZONE1: ['OR', 'WA', 'ID'],
  ZONE2: ['CA', 'NV', 'MT', 'WY'],
  ZONE3: ['AZ', 'UT', 'NM', 'CO'],
  // Add more zones as needed
};

type ShippingZone = keyof typeof SHIPPING_ZONES | 'DEFAULT';
type ShippingMethod = 'ground' | 'twoDay' | 'overnight';

const BASE_RATES: Record<ShippingMethod, Record<ShippingZone, number>> = {
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

const ESTIMATED_DAYS: Record<ShippingMethod, Record<ShippingZone, string>> = {
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

function getShippingZone(state: string): ShippingZone {
  const zone1States = new Set(SHIPPING_ZONES.ZONE1);
  const zone2States = new Set(SHIPPING_ZONES.ZONE2);
  const zone3States = new Set(SHIPPING_ZONES.ZONE3);

  if (zone1States.has(state)) return 'ZONE1';
  if (zone2States.has(state)) return 'ZONE2';
  if (zone3States.has(state)) return 'ZONE3';
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

  const methods: ShippingMethod[] = ['ground', 'twoDay', 'overnight'];
  
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