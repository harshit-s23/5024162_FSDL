// Carbon factors in kg CO2e per unit
const CARBON_FACTORS = {
  transport: {
    car_petrol: { factor: 0.21, unit: 'km', label: 'Car (Petrol) per km' },
    car_diesel: { factor: 0.17, unit: 'km', label: 'Car (Diesel) per km' },
    car_electric: { factor: 0.05, unit: 'km', label: 'Car (Electric) per km' },
    motorcycle: { factor: 0.11, unit: 'km', label: 'Motorcycle per km' },
    bus: { factor: 0.089, unit: 'km', label: 'Bus per km' },
    train: { factor: 0.041, unit: 'km', label: 'Train per km' },
    flight_domestic: { factor: 0.255, unit: 'km', label: 'Domestic Flight per km' },
    flight_international: { factor: 0.195, unit: 'km', label: 'International Flight per km' },
    cycling: { factor: -0.02, unit: 'km', label: 'Cycling per km (saves emissions)' },
    walking: { factor: -0.01, unit: 'km', label: 'Walking per km (saves emissions)' },
  },
  food: {
    beef: { factor: 27.0, unit: 'kg', label: 'Beef per kg' },
    lamb: { factor: 39.2, unit: 'kg', label: 'Lamb per kg' },
    pork: { factor: 12.1, unit: 'kg', label: 'Pork per kg' },
    chicken: { factor: 6.9, unit: 'kg', label: 'Chicken per kg' },
    fish: { factor: 6.1, unit: 'kg', label: 'Fish per kg' },
    dairy: { factor: 3.2, unit: 'kg', label: 'Dairy per kg' },
    vegetables: { factor: 2.0, unit: 'kg', label: 'Vegetables per kg' },
    fruits: { factor: 1.1, unit: 'kg', label: 'Fruits per kg' },
    grains: { factor: 1.4, unit: 'kg', label: 'Grains per kg' },
    plant_based_meal: { factor: 0.5, unit: 'meal', label: 'Plant-based meal' },
    vegan_meal: { factor: 0.3, unit: 'meal', label: 'Vegan meal' },
  },
  energy: {
    electricity: { factor: 0.233, unit: 'kWh', label: 'Electricity per kWh' },
    natural_gas: { factor: 2.04, unit: 'm3', label: 'Natural Gas per m³' },
    solar_panel: { factor: -0.05, unit: 'kWh', label: 'Solar energy generated' },
    home_heating_oil: { factor: 2.52, unit: 'litre', label: 'Heating oil per litre' },
    led_switch: { factor: -0.01, unit: 'hour', label: 'LED lighting saving per hour' },
  },
  shopping: {
    clothing: { factor: 5.0, unit: 'item', label: 'Clothing item' },
    electronics: { factor: 70.0, unit: 'item', label: 'Electronics item' },
    furniture: { factor: 40.0, unit: 'item', label: 'Furniture item' },
    online_shopping: { factor: 0.5, unit: 'parcel', label: 'Online delivery parcel' },
    secondhand: { factor: -2.0, unit: 'item', label: 'Secondhand purchase (saves)' },
  },
  waste: {
    recycling: { factor: -0.5, unit: 'kg', label: 'Recycling per kg (saves)' },
    composting: { factor: -0.3, unit: 'kg', label: 'Composting per kg (saves)' },
    landfill: { factor: 0.58, unit: 'kg', label: 'Landfill waste per kg' },
    plastic_waste: { factor: 6.0, unit: 'kg', label: 'Plastic to landfill per kg' },
  },
  water: {
    shower: { factor: 0.023, unit: 'minute', label: 'Shower per minute' },
    bath: { factor: 0.092, unit: 'bath', label: 'Full bath' },
    short_shower: { factor: -0.046, unit: 'shower', label: 'Short shower vs bath (saves)' },
  },
  other: {
    tree_planted: { factor: -21.77, unit: 'tree', label: 'Tree planted (annual saving)' },
    offset: { factor: -1.0, unit: 'kg', label: 'Carbon offset per kg' },
  },
};

const ECO_LEVELS = [
  { name: 'Seedling', minScore: 0, maxScore: 30, emoji: '🌱', color: '#a8d8a8' },
  { name: 'Sprout', minScore: 30, maxScore: 50, emoji: '🌿', color: '#74c69d' },
  { name: 'Leaf', minScore: 50, maxScore: 65, emoji: '🍃', color: '#52b788' },
  { name: 'Tree', minScore: 65, maxScore: 80, emoji: '🌳', color: '#40916c' },
  { name: 'Forest', minScore: 80, maxScore: 90, emoji: '🌲', color: '#2d6a4f' },
  { name: 'Earth Guardian', minScore: 90, maxScore: 100, emoji: '🌍', color: '#1b4332' },
];

const BADGES = [
  { id: 'first_task', name: 'First Step', description: 'Logged your first eco task', emoji: '🎯', condition: 'tasks >= 1' },
  { id: 'week_streak', name: 'Week Warrior', description: '7-day logging streak', emoji: '🔥', condition: 'streak >= 7' },
  { id: 'carbon_saver', name: 'Carbon Saver', description: 'Saved 10kg CO2 in a week', emoji: '💚', condition: 'weekly_saved >= 10' },
  { id: 'green_commuter', name: 'Green Commuter', description: 'Used eco transport 5 times', emoji: '🚲', condition: 'eco_transport >= 5' },
  { id: 'plant_power', name: 'Plant Power', description: 'Chose plant-based 10 times', emoji: '🥗', condition: 'plant_meals >= 10' },
  { id: 'energy_saver', name: 'Energy Saver', description: 'Reduced energy by 20% this week', emoji: '⚡', condition: 'energy_reduced >= 20' },
  { id: 'recycler', name: 'Recycler Pro', description: 'Recycled 50kg of waste', emoji: '♻️', condition: 'recycled >= 50' },
  { id: 'earth_guardian', name: 'Earth Guardian', description: 'Achieved maximum eco score', emoji: '🌍', condition: 'score >= 90' },
];

function calculateCarbonValue(category, subcategory, quantity = 1) {
  const categoryFactors = CARBON_FACTORS[category];
  if (!categoryFactors) return 0;
  const subFactor = categoryFactors[subcategory];
  if (!subFactor) return 0;
  return parseFloat((subFactor.factor * quantity).toFixed(3));
}

function calculateEcoScore(totalCarbon, days = 30) {
  // Average daily carbon in kg, global average is ~13kg/day
  const dailyAvg = days > 0 ? totalCarbon / days : totalCarbon;
  const globalAvg = 13;
  // Score: lower emissions = higher score
  const ratio = dailyAvg / globalAvg;
  const score = Math.max(0, Math.min(100, 100 - (ratio * 50)));
  return parseFloat(score.toFixed(1));
}

function getEcoLevel(score) {
  return ECO_LEVELS.find(l => score >= l.minScore && score <= l.maxScore) || ECO_LEVELS[0];
}

function generateSuggestions(tasksByCategory) {
  const suggestions = [];
  
  if (tasksByCategory.transport?.totalCarbon > 5) {
    suggestions.push({
      category: 'transport',
      tip: 'Switch to public transport or cycling to cut your travel emissions by up to 70%.',
      impact: 'Save ~3.5 kg CO2 per day',
      icon: '🚲',
    });
  }
  if (tasksByCategory.food?.totalCarbon > 8) {
    suggestions.push({
      category: 'food',
      tip: 'Try one plant-based meal per day. It can reduce your food footprint significantly.',
      impact: 'Save ~2.5 kg CO2 per meal',
      icon: '🥗',
    });
  }
  if (tasksByCategory.energy?.totalCarbon > 3) {
    suggestions.push({
      category: 'energy',
      tip: 'Switch to LED lighting and unplug devices on standby to reduce home energy use.',
      impact: 'Save ~1.2 kg CO2 per day',
      icon: '💡',
    });
  }
  if (!tasksByCategory.waste || tasksByCategory.waste.count < 3) {
    suggestions.push({
      category: 'waste',
      tip: 'Start composting and recycling to divert waste from landfill.',
      impact: 'Save ~0.5 kg CO2 per kg recycled',
      icon: '♻️',
    });
  }
  if (suggestions.length < 2) {
    suggestions.push({
      category: 'general',
      tip: 'Plant a tree to offset ~21 kg CO2 annually and support biodiversity.',
      impact: 'Offset 21.77 kg CO2 per tree/year',
      icon: '🌳',
    });
  }
  
  return suggestions.slice(0, 3);
}

function checkBadges(user, stats) {
  const currentBadges = user.badges || [];
  const newBadges = [];
  
  if (stats.totalTasks >= 1 && !currentBadges.find(b => b.id === 'first_task')) {
    newBadges.push(BADGES.find(b => b.id === 'first_task'));
  }
  if (user.streak >= 7 && !currentBadges.find(b => b.id === 'week_streak')) {
    newBadges.push(BADGES.find(b => b.id === 'week_streak'));
  }
  if (stats.ecoScore >= 90 && !currentBadges.find(b => b.id === 'earth_guardian')) {
    newBadges.push(BADGES.find(b => b.id === 'earth_guardian'));
  }
  
  return [...currentBadges, ...newBadges.filter(Boolean)];
}

function updateStreak(user) {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = user.lastActiveDate;
  
  if (!lastActive || lastActive === today) {
    return user.streak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastActive === yesterdayStr) {
    return user.streak + 1;
  }
  
  return 1; // Reset streak
}

module.exports = {
  CARBON_FACTORS,
  ECO_LEVELS,
  BADGES,
  calculateCarbonValue,
  calculateEcoScore,
  getEcoLevel,
  generateSuggestions,
  checkBadges,
  updateStreak,
};
