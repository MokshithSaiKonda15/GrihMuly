// src/services/housePricePredictor.ts

export interface HouseFeatures {
  area: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  mainroad: boolean;
  guestroom: boolean;
  basement: boolean;
  hotwaterheating: boolean;
  airconditioning: boolean;
  parking: number;
  prefarea: boolean;
  furnishingStatus: 'semi-furnished' | 'unfurnished' | 'furnished';
}

// Weights and Intercept extracted directly from house_model.pkl (LinearRegression)
const MODEL_CONFIG = {
  intercept: -116911.84307199251,
  coefficients: {
    area: 237.544265,
    bedrooms: 79409.6303,
    bathrooms: 1110010.03,
    stories: 425103.527,
    mainroad: 246692.622,
    guestroom: 27328.8492,
    basement: 409537.346,
    hotwaterheating: 243806.288,
    airconditioning: 434143.881,
    parking: 712550.551,
    prefarea: 804116.386,
    furnishing: 636406.157,
  },
  // Mapping defined in Sample.py:
  // 'semi-furnished': 1, 'unfurnished': 2, 'furnished': 3
  furnishingMap: {
    'semi-furnished': 1,
    'unfurnished': 2,
    'furnished': 3,
  },
};

export function predictHousePrice(features: HouseFeatures): number {
  const {
    area,
    bedrooms,
    bathrooms,
    stories,
    mainroad,
    guestroom,
    basement,
    hotwaterheating,
    airconditioning,
    parking,
    prefarea,
    furnishingStatus,
  } = features;

  const furnValue = MODEL_CONFIG.furnishingMap[furnishingStatus];

  // Exactly matches model.predict(new_data) in inp.py & app_streamlit.py
  const price =
    MODEL_CONFIG.intercept +
    MODEL_CONFIG.coefficients.area * area +
    MODEL_CONFIG.coefficients.bedrooms * bedrooms +
    MODEL_CONFIG.coefficients.bathrooms * bathrooms +
    MODEL_CONFIG.coefficients.stories * stories +
    MODEL_CONFIG.coefficients.mainroad * (mainroad ? 1 : 0) +
    MODEL_CONFIG.coefficients.guestroom * (guestroom ? 1 : 0) +
    MODEL_CONFIG.coefficients.basement * (basement ? 1 : 0) +
    MODEL_CONFIG.coefficients.hotwaterheating * (hotwaterheating ? 1 : 0) +
    MODEL_CONFIG.coefficients.airconditioning * (airconditioning ? 1 : 0) +
    MODEL_CONFIG.coefficients.parking * parking +
    MODEL_CONFIG.coefficients.prefarea * (prefarea ? 1 : 0) +
    MODEL_CONFIG.coefficients.furnishing * furnValue;

  return Math.max(0, Math.round(price));
}

// Indian Rupee formatting utility (₹ XX,XX,XXX)
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}