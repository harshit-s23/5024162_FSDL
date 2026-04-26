export const CATEGORIES = [
  { value: 'transport', label: 'Transport', emoji: '🚗', color: '#0369a1', bg: '#e0f2fe' },
  { value: 'food',      label: 'Food',      emoji: '🍽️', color: '#15803d', bg: '#dcfce7' },
  { value: 'energy',    label: 'Energy',    emoji: '⚡', color: '#b45309', bg: '#fef3c7' },
  { value: 'shopping',  label: 'Shopping',  emoji: '🛍️', color: '#7c3aed', bg: '#ede9fe' },
  { value: 'waste',     label: 'Waste',     emoji: '♻️', color: '#065f46', bg: '#d1fae5' },
  { value: 'water',     label: 'Water',     emoji: '💧', color: '#0284c7', bg: '#e0f2fe' },
  { value: 'other',     label: 'Other',     emoji: '🌿', color: '#6b7280', bg: '#f3f4f6' },
];

export const SUBCATEGORIES = {
  transport: [
    { value: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
    { value: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
    { value: 'car_electric', label: 'Car (Electric)', unit: 'km' },
    { value: 'motorcycle', label: 'Motorcycle', unit: 'km' },
    { value: 'bus', label: 'Bus', unit: 'km' },
    { value: 'train', label: 'Train', unit: 'km' },
    { value: 'flight_domestic', label: 'Domestic Flight', unit: 'km' },
    { value: 'flight_international', label: 'International Flight', unit: 'km' },
    { value: 'cycling', label: 'Cycling 🟢', unit: 'km' },
    { value: 'walking', label: 'Walking 🟢', unit: 'km' },
  ],
  food: [
    { value: 'beef', label: 'Beef', unit: 'kg' },
    { value: 'lamb', label: 'Lamb', unit: 'kg' },
    { value: 'pork', label: 'Pork', unit: 'kg' },
    { value: 'chicken', label: 'Chicken', unit: 'kg' },
    { value: 'fish', label: 'Fish', unit: 'kg' },
    { value: 'dairy', label: 'Dairy', unit: 'kg' },
    { value: 'vegetables', label: 'Vegetables', unit: 'kg' },
    { value: 'plant_based_meal', label: 'Plant-based Meal 🟢', unit: 'meal' },
    { value: 'vegan_meal', label: 'Vegan Meal 🟢', unit: 'meal' },
  ],
  energy: [
    { value: 'electricity', label: 'Electricity', unit: 'kWh' },
    { value: 'natural_gas', label: 'Natural Gas', unit: 'm³' },
    { value: 'home_heating_oil', label: 'Heating Oil', unit: 'litre' },
    { value: 'solar_panel', label: 'Solar Generated 🟢', unit: 'kWh' },
    { value: 'led_switch', label: 'LED Lighting 🟢', unit: 'hour' },
  ],
  shopping: [
    { value: 'clothing', label: 'Clothing', unit: 'item' },
    { value: 'electronics', label: 'Electronics', unit: 'item' },
    { value: 'furniture', label: 'Furniture', unit: 'item' },
    { value: 'online_shopping', label: 'Online Delivery', unit: 'parcel' },
    { value: 'secondhand', label: 'Secondhand Purchase 🟢', unit: 'item' },
  ],
  waste: [
    { value: 'landfill', label: 'Landfill Waste', unit: 'kg' },
    { value: 'plastic_waste', label: 'Plastic Waste', unit: 'kg' },
    { value: 'recycling', label: 'Recycling 🟢', unit: 'kg' },
    { value: 'composting', label: 'Composting 🟢', unit: 'kg' },
  ],
  water: [
    { value: 'shower', label: 'Shower', unit: 'minute' },
    { value: 'bath', label: 'Full Bath', unit: 'bath' },
    { value: 'short_shower', label: 'Short Shower 🟢', unit: 'shower' },
  ],
  other: [
    { value: 'tree_planted', label: 'Tree Planted 🟢', unit: 'tree' },
    { value: 'offset', label: 'Carbon Offset 🟢', unit: 'kg' },
  ],
};

export const ECO_LEVELS = [
  { name: 'Seedling', emoji: '🌱', color: '#a8d8a8', min: 0 },
  { name: 'Sprout',   emoji: '🌿', color: '#74c69d', min: 30 },
  { name: 'Leaf',     emoji: '🍃', color: '#52b788', min: 50 },
  { name: 'Tree',     emoji: '🌳', color: '#40916c', min: 65 },
  { name: 'Forest',   emoji: '🌲', color: '#2d6a4f', min: 80 },
  { name: 'Earth Guardian', emoji: '🌍', color: '#1b4332', min: 90 },
];

export const getCategoryMeta = (value) =>
  CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];

export const formatCarbon = (val) => {
  if (val === null || val === undefined) return '0.00';
  return Math.abs(val).toFixed(2);
};

export const carbonLabel = (val) => (val < 0 ? '−' : '+') + formatCarbon(val) + ' kg CO₂';

export const todayStr = () => new Date().toISOString().split('T')[0];
