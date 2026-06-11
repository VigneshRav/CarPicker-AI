const fs = require('fs');
const path = require('path');

// Load cars dataset
const carsDataPath = path.join(__dirname, '../data/cars.json');
let cars = [];

try {
  const fileContent = fs.readFileSync(carsDataPath, 'utf8');
  cars = JSON.parse(fileContent);
} catch (error) {
  console.error('Failed to load cars dataset from cars.json:', error);
}

/**
 * Computes recommendation score for a single car based on user preferences.
 */
const calculateMatchScore = (car, preferences) => {
  const {
    budget,
    fuelType,
    familySize,
    usage,
    safetyPriority,
    mileagePriority
  } = preferences;

  // 1. HARD CONSTRAINTS FILTER
  // A. Seating Capacity check: must accommodate the family size
  if (car.seatingCapacity < familySize) {
    return null;
  }

  // B. Budget check: must be within budget
  if (car.price > budget) {
    return null;
  }

  // 2. COMPONENT SCORING (Each scored 0 to 100)

  // A. Budget Match Score
  // Closer to budget gives a higher score, but cheaper options should still be highly competitive.
  const budgetRatio = car.price / budget;
  const budgetScore = 80 + (budgetRatio * 20); // Scale 80 to 100

  // B. Fuel Match Score
  let fuelScore = 0;
  const preferredFuel = fuelType.toLowerCase();
  const carFuel = car.fuelType.toLowerCase();

  if (preferredFuel === 'any' || preferredFuel === carFuel) {
    fuelScore = 100;
  } else if (
    (preferredFuel === 'hybrid' && carFuel === 'electric') ||
    (preferredFuel === 'electric' && carFuel === 'hybrid')
  ) {
    fuelScore = 50; // Partial match for eco-friendly alternatives
  } else {
    fuelScore = 0;
  }

  // C. Seating Capacity Suitability Score
  let seatingScore = 100;
  if (car.seatingCapacity > familySize) {
    // Slight penalty for excess capacity (overkill)
    seatingScore = Math.max(70, 100 - (car.seatingCapacity - familySize) * 10);
  }

  // D. Safety Score
  const safetyScore = (car.safetyRating / 5) * 100;

  // E. Mileage / Efficiency Score
  let efficiencyScore = 0;
  if (carFuel === 'electric') {
    // Assume 500 km range is 100% efficient
    efficiencyScore = Math.min((car.mileage / 500) * 100, 100);
  } else {
    // Assume 28 kmpl is 100% efficient
    efficiencyScore = Math.min((car.mileage / 28) * 100, 100);
  }
  const mileageScore = efficiencyScore;

  // F. Usage Suitability Score
  let usageScore = 70; // default base score
  const selectedUsage = usage.toLowerCase();
  const isEcoFriendly = ['electric', 'hybrid', 'cng'].includes(carFuel);

  if (selectedUsage === 'daily-commute') {
    // Daily commute values high mileage and eco-friendly engine
    usageScore = (mileageScore * 0.7) + (isEcoFriendly ? 30 : 0);
  } else if (selectedUsage === 'family-trips') {
    // Family trips favor high safety, seating capacity >= 5, and MUV/SUV styles
    const seatsFactor = car.seatingCapacity >= 7 ? 100 : (car.seatingCapacity >= 5 ? 85 : 50);
    usageScore = (seatsFactor * 0.6) + (car.safetyRating >= 4 ? 40 : 20);
  } else if (selectedUsage === 'off-roading') {
    // Offroading favors SUV types and robust diesel models or AWD
    const isSUV = car.type.toUpperCase() === 'SUV';
    const isOffroadBrand = ['mahindra', 'jeep'].includes(car.brand.toLowerCase());
    usageScore = (isSUV || isOffroadBrand) ? 100 : 30;
  } else if (selectedUsage === 'highway-cruising') {
    // Highway cruising favors safety, stable structures (sedans/SUVs), and range/power
    const isCruiserType = ['sedan', 'suv'].includes(car.type.toLowerCase());
    usageScore = (safetyScore * 0.6) + (isCruiserType ? 40 : 20);
  }

  // 3. DYNAMIC WEIGHTING SYSTEM
  const weights = {
    budget: 0.25,
    fuel: 0.15,
    seating: 0.15,
    usage: 0.15,
    safety: 0.15,
    mileage: 0.15
  };

  // Adjust Safety Priority weight
  if (safetyPriority.toLowerCase() === 'high') {
    weights.safety = 0.25;
  } else if (safetyPriority.toLowerCase() === 'low') {
    weights.safety = 0.05;
  }

  // Adjust Mileage Priority weight
  if (mileagePriority.toLowerCase() === 'high') {
    weights.mileage = 0.25;
  } else if (mileagePriority.toLowerCase() === 'low') {
    weights.mileage = 0.05;
  }

  // Normalize weights so they sum exactly to 1.0
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const normalizedWeights = {};
  for (const key in weights) {
    normalizedWeights[key] = weights[key] / totalWeight;
  }

  // Calculate Weighted Score
  const finalScore =
    (budgetScore * normalizedWeights.budget) +
    (fuelScore * normalizedWeights.fuel) +
    (seatingScore * normalizedWeights.seating) +
    (usageScore * normalizedWeights.usage) +
    (safetyScore * normalizedWeights.safety) +
    (mileageScore * normalizedWeights.mileage);

  const matchPercentage = Math.round(finalScore);

  // 4. GENERATING MATCH REASONS
  const matchReasons = [];

  // Budget Reason
  const priceDifference = budget - car.price;
  if (priceDifference >= 100000) {
    const lakhs = (priceDifference / 100000).toFixed(1);
    matchReasons.push(`Great value: Saves you approx ₹${lakhs} Lakhs off your budget.`);
  } else {
    matchReasons.push('Fits comfortably within your maximum budget.');
  }

  // Fuel Reason
  if (preferredFuel !== 'any') {
    matchReasons.push(`Runs on ${car.fuelType}, matching your fuel preference.`);
  } else if (isEcoFriendly) {
    matchReasons.push(`Eco-friendly green mobility option (${car.fuelType}).`);
  }

  // Seating Reason
  if (car.seatingCapacity === familySize) {
    matchReasons.push(`Perfect seating configuration for a family size of ${familySize}.`);
  } else {
    matchReasons.push(`Spacious ${car.seatingCapacity}-seater layout accommodates your family of ${familySize} with extra comfort.`);
  }

  // Safety Reason
  if (car.safetyRating >= 4) {
    matchReasons.push(`Excellent ${car.safetyRating}-Star safety rating to protect your family.`);
  }

  // Mileage Reason
  if (car.mileage >= 20 || carFuel === 'electric') {
    const stat = carFuel === 'electric' ? `${car.mileage} km battery range` : `${car.mileage} kmpl mileage`;
    matchReasons.push(`High efficiency configuration (${stat}) reduces long-term running costs.`);
  }

  // Usage Reason
  if (selectedUsage === 'off-roading' && (car.type.toUpperCase() === 'SUV' || car.brand.toLowerCase() === 'mahindra')) {
    matchReasons.push('Robust build and high clearance suitable for rugged off-road terrains.');
  } else if (selectedUsage === 'daily-commute' && (car.mileage >= 20 || isEcoFriendly)) {
    matchReasons.push('Highly economical and nimble, perfect for congested daily city commutes.');
  } else if (selectedUsage === 'family-trips' && car.seatingCapacity >= 7) {
    matchReasons.push('Large seating capacity and luggage space ideal for long weekend road trips.');
  } else if (selectedUsage === 'highway-cruising' && car.safetyRating >= 4) {
    matchReasons.push('High safety rating, comfort, and stable highway manners make cruising effortless.');
  }

  // Cap at top 3 reasons to keep UI clean
  const limitedReasons = matchReasons.slice(0, 3);

  // 5. GENERATING NATURAL LANGUAGE AI EXPLANATION
  const explanationClauses = [];

  // Clause A: Budget match
  const isWellUnderBudget = budget - car.price >= 150000;
  if (isWellUnderBudget) {
    explanationClauses.push(`matches your budget perfectly (saving ₹${((budget - car.price)/100000).toFixed(1)} Lakhs)`);
  } else {
    explanationClauses.push('aligns well with your budget limits');
  }

  // Clause B: Safety / Efficiency Priority focus
  if (safetyPriority.toLowerCase() === 'high' && car.safetyRating >= 4) {
    explanationClauses.push(`offers a premium ${car.safetyRating}-star safety rating`);
  } else if (mileagePriority.toLowerCase() === 'high') {
    const isElectric = car.fuelType.toLowerCase() === 'electric';
    explanationClauses.push(`delivers excellent efficiency at ${car.mileage} ${isElectric ? 'km range' : 'kmpl'}`);
  } else {
    explanationClauses.push(`provides a solid ${car.safetyRating}-star safety rating`);
  }

  // Clause C: Usage suitability
  if (selectedUsage === 'daily-commute') {
    explanationClauses.push('performs exceptionally well for daily city driving');
  } else if (selectedUsage === 'highway-cruising') {
    explanationClauses.push('handles smoothly at high speeds for highway cruising');
  } else if (selectedUsage === 'family-trips') {
    explanationClauses.push(`fits family trips effortlessly with its spacious ${car.seatingCapacity}-seater layout`);
  } else if (selectedUsage === 'off-roading') {
    explanationClauses.push('is built ruggedly with high ground clearance for off-road terrains');
  }

  // Combine clauses
  let explanation = `${car.brand} ${car.name} is recommended because it `;
  if (explanationClauses.length > 0) {
    if (explanationClauses.length === 1) {
      explanation += explanationClauses[0] + '.';
    } else if (explanationClauses.length === 2) {
      explanation += `${explanationClauses[0]} and ${explanationClauses[1]}.`;
    } else {
      const last = explanationClauses.pop();
      explanation += `${explanationClauses.join(', ')}, and ${last}.`;
    }
  } else {
    explanation += 'matches your lifestyle needs and transport preferences.';
  }

  return {
    ...car,
    matchPercentage,
    matchReasons: limitedReasons,
    explanation
  };
};

/**
 * Main Service method to fetch scored car recommendations.
 */
exports.getRecommendations = (preferences) => {
  const scoredCars = cars
    .map(car => calculateMatchScore(car, preferences))
    .filter(car => car !== null) // Filter out disqualified cars
    .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort highest score first

  // Return the top 3 matches
  return scoredCars.slice(0, 3);
};
