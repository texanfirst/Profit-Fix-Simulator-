import { 
  SimQualityTier, SimStaffingLevel, SimMarketingCampaign, 
  SimUpgrade, SimDayResult, SimCustomerReview, SimDailyDilemma 
} from '../types';
import { BusinessSimConfig, AVAILABLE_SIM_UPGRADES } from '../data/simGameData';

export interface SimDayInput {
  dayNumber: number;
  config: BusinessSimConfig;
  price: number;
  quality: SimQualityTier;
  staffing: SimStaffingLevel;
  marketing: SimMarketingCampaign;
  unlockedUpgradeIds: string[];
  currentReputation: number; // 1 to 5
  dilemmaChoice?: {
    dilemma: SimDailyDilemma;
    choiceIndex: number;
  };
}

export function simulateSingleDay(input: SimDayInput): SimDayResult {
  const { dayNumber, config, price, quality, staffing, marketing, unlockedUpgradeIds, currentReputation, dilemmaChoice } = input;
  
  const activeUpgrades = AVAILABLE_SIM_UPGRADES.filter((u) => unlockedUpgradeIds.includes(u.id));

  // Day Name
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayName = dayNames[(dayNumber - 1) % dayNames.length] || `Day ${dayNumber}`;

  // 1. Quality Multipliers
  let unitCostMultiplier = 1.0;
  let qualitySatisfactionDelta = 0;
  let qualityDemandDelta = 0;

  if (quality === 'budget') {
    unitCostMultiplier = 0.68;
    qualitySatisfactionDelta = -14;
    qualityDemandDelta = -5;
  } else if (quality === 'standard') {
    unitCostMultiplier = 1.0;
    qualitySatisfactionDelta = 2;
    qualityDemandDelta = 0;
  } else if (quality === 'premium') {
    unitCostMultiplier = 1.42;
    qualitySatisfactionDelta = 18;
    qualityDemandDelta = 12;
  }

  // Check bulk supplier upgrade
  if (unlockedUpgradeIds.includes('bulk_supplier_deal')) {
    unitCostMultiplier *= 0.85;
  }

  const calculatedUnitCost = Number((config.baseUnitCost * unitCostMultiplier).toFixed(2));

  // 2. Staffing Metrics & Labor Costs
  let baseLaborCost = 75;
  let serviceCapacity = 85;
  let speedSatisfactionDelta = 0;

  if (staffing === 'understaffed') {
    baseLaborCost = 35;
    serviceCapacity = 50;
    speedSatisfactionDelta = -18;
  } else if (staffing === 'balanced') {
    baseLaborCost = 80;
    serviceCapacity = 95;
    speedSatisfactionDelta = 0;
  } else if (staffing === 'rush_ready') {
    baseLaborCost = 135;
    serviceCapacity = 160;
    speedSatisfactionDelta = 8;
  }

  // Check POS Automation labor savings
  let laborCost = baseLaborCost;
  if (unlockedUpgradeIds.includes('pos_automation')) {
    laborCost = Math.max(20, laborCost - 25);
    serviceCapacity += 20;
  }

  // Check Turbo equipment
  if (unlockedUpgradeIds.includes('turbo_equipment')) {
    serviceCapacity += 35;
  }

  // 3. Marketing Demand Boosts & Costs
  let marketingCost = 0;
  let marketingTrafficMultiplier = 1.0;

  if (marketing === 'none') {
    marketingCost = 0;
    marketingTrafficMultiplier = 1.0;
  } else if (marketing === 'social_media') {
    marketingCost = 30;
    marketingTrafficMultiplier = 1.28;
  } else if (marketing === 'influencer') {
    marketingCost = 75;
    marketingTrafficMultiplier = 1.65;
  }

  // 4. Reputation & Upgrade Traffic Modifiers
  const reputationFactor = 0.8 + (currentReputation / 5) * 0.35; // 0.8 to 1.15
  let upgradeTrafficBonus = 0;
  if (unlockedUpgradeIds.includes('vip_loyalty_app')) {
    upgradeTrafficBonus += 0.22;
  }
  if (unlockedUpgradeIds.includes('turbo_equipment')) {
    upgradeTrafficBonus += 0.08;
  }

  // 5. Price Elasticity Curve
  const priceRatio = price / config.idealPrice;
  let priceElasticityMultiplier = 1.0;
  let priceSatisfactionDelta = 0;

  if (priceRatio <= 0.7) {
    // Super cheap! High volume, very happy price reviews
    priceElasticityMultiplier = 1.35;
    priceSatisfactionDelta = 16;
  } else if (priceRatio <= 1.0) {
    // Fair bargain
    priceElasticityMultiplier = 1.0 + (1.0 - priceRatio) * 0.8;
    priceSatisfactionDelta = 8;
  } else if (priceRatio <= 1.3) {
    // Slightly elevated
    priceElasticityMultiplier = 1.0 - (priceRatio - 1.0) * 0.9;
    priceSatisfactionDelta = -8;
  } else if (priceRatio <= 1.7) {
    // Expensive
    priceElasticityMultiplier = 0.7 - (priceRatio - 1.3) * 1.1;
    priceSatisfactionDelta = -20;
  } else {
    // Absurdly high
    priceElasticityMultiplier = 0.35;
    priceSatisfactionDelta = -35;
  }

  // Quality tolerance adjustment (Premium offsets price resistance)
  if (quality === 'premium' && priceRatio > 1.0) {
    priceElasticityMultiplier += 0.15;
    priceSatisfactionDelta += 8;
  }

  // 6. Calculate Total Foot Traffic & Served Customers
  const rawTraffic = config.baseFootTraffic 
    * priceElasticityMultiplier 
    * marketingTrafficMultiplier 
    * reputationFactor 
    * (1 + upgradeTrafficBonus) 
    + qualityDemandDelta;

  const totalCustomers = Math.max(12, Math.round(rawTraffic));

  let walkouts = 0;
  if (totalCustomers > serviceCapacity) {
    const overflow = totalCustomers - serviceCapacity;
    const walkoutRate = staffing === 'understaffed' ? 0.65 : 0.35;
    walkouts = Math.round(overflow * walkoutRate);
  }

  const servedCustomers = Math.max(5, totalCustomers - walkouts);

  // 7. Upsell & Avg Ticket Value
  let upsellMultiplier = 1.0;
  if (unlockedUpgradeIds.includes('combo_upsell_script')) {
    upsellMultiplier = 1.20;
  }

  // 8. Dilemma Resolution Impact
  let dilemmaCost = 0;
  let dilemmaRevBonus = 0;
  let dilemmaSatBonus = 0;
  let dilemmaResolved: SimDayResult['dilemmaResolved'] = undefined;

  if (dilemmaChoice) {
    const choice = dilemmaChoice.dilemma.choices[dilemmaChoice.choiceIndex];
    if (choice) {
      dilemmaCost = choice.cost;
      dilemmaRevBonus = choice.revBonus;
      dilemmaSatBonus = choice.satBonus;
      dilemmaResolved = {
        title: dilemmaChoice.dilemma.title,
        chosenOption: choice.label,
        outcomeText: choice.outcomeText,
      };
    }
  }

  // 9. Financial Computations ($R - $E = $P$)
  const baseRevenue = Math.round(servedCustomers * price * upsellMultiplier);
  const revenue = Math.max(0, baseRevenue + dilemmaRevBonus);

  let fixedRent = config.baselineDailyRent;
  if (unlockedUpgradeIds.includes('eco_solar_saving')) {
    fixedRent = Math.max(20, fixedRent - 18);
  }

  const cogsExpenses = Math.round(servedCustomers * calculatedUnitCost);
  const laborExpenses = Math.round(laborCost);
  const marketingExpenses = Math.round(marketingCost);
  const dilemmaExpenses = Math.round(dilemmaCost);

  const totalExpenses = fixedRent + cogsExpenses + laborExpenses + marketingExpenses + dilemmaExpenses;
  const netProfit = revenue - totalExpenses;

  // 10. Satisfaction Calculation (0 - 100%)
  let baseSatisfaction = 75;
  baseSatisfaction += qualitySatisfactionDelta;
  baseSatisfaction += speedSatisfactionDelta;
  baseSatisfaction += priceSatisfactionDelta;
  baseSatisfaction += dilemmaSatBonus;

  // Penalty for walkouts
  if (walkouts > 0) {
    baseSatisfaction -= Math.min(25, Math.round((walkouts / totalCustomers) * 35));
  }

  // Upgrade bonuses
  activeUpgrades.forEach((u) => {
    if (u.satisfactionBonus) baseSatisfaction += u.satisfactionBonus;
  });

  const satisfactionPct = Math.min(100, Math.max(15, baseSatisfaction));

  // Compute Reputation Stars (1.0 to 5.0)
  const reputationStars = Number((satisfactionPct / 20).toFixed(1));

  // 11. Generate Realistic Customer Reviews
  const customerReviews: SimCustomerReview[] = generateReviews({
    priceRatio,
    quality,
    staffing,
    walkouts,
    satisfactionPct,
    hasLoyalty: unlockedUpgradeIds.includes('vip_loyalty_app'),
    hasCombo: unlockedUpgradeIds.includes('combo_upsell_script'),
    businessName: config.name,
  });

  return {
    dayNumber,
    dayName,
    price,
    quality,
    staffing,
    marketing,
    activeUpgradeIds: unlockedUpgradeIds,
    totalCustomers,
    servedCustomers,
    walkouts,
    unitCost: calculatedUnitCost,
    revenue,
    fixedRentExpenses: fixedRent,
    cogsExpenses,
    laborExpenses,
    marketingExpenses,
    dilemmaExpenses,
    totalExpenses,
    netProfit,
    satisfactionPct,
    reputationStars,
    customerReviews,
    dilemmaResolved,
  };
}

interface ReviewGenParams {
  priceRatio: number;
  quality: SimQualityTier;
  staffing: SimStaffingLevel;
  walkouts: number;
  satisfactionPct: number;
  hasLoyalty: boolean;
  hasCombo: boolean;
  businessName: string;
}

function generateReviews(params: ReviewGenParams): SimCustomerReview[] {
  const reviews: SimCustomerReview[] = [];
  const avatars = ['🧑‍🎓', '👩‍💼', '🧔', '👧', '🧑‍🔬', '👨‍🍳', '👩‍🎨', '🏃‍♀️'];
  const names = ['Jordan P.', 'Sammy L.', 'Taylor K.', 'Morgan B.', 'Riley V.', 'Casey D.', 'Alex R.'];

  // Review 1: Price / Value feedback
  if (params.priceRatio > 1.35 && params.quality !== 'premium') {
    reviews.push({
      id: 'rev-1',
      author: names[0],
      avatar: avatars[0],
      stars: 2,
      comment: `A bit pricey for what you get. Charged high prices without gourmet taste!`,
      tag: 'price',
    });
  } else if (params.priceRatio <= 0.8) {
    reviews.push({
      id: 'rev-1',
      author: names[1],
      avatar: avatars[1],
      stars: 5,
      comment: `Incredible prices! Best deal in town for students on a budget.`,
      tag: 'price',
    });
  } else {
    reviews.push({
      id: 'rev-1',
      author: names[2],
      avatar: avatars[2],
      stars: 4,
      comment: `Fair, honest pricing. Good value for money!`,
      tag: 'price',
    });
  }

  // Review 2: Speed / Service Staffing feedback
  if (params.staffing === 'understaffed' || params.walkouts > 8) {
    reviews.push({
      id: 'rev-2',
      author: names[3],
      avatar: avatars[3],
      stars: 1,
      comment: `Waited in line for 25 minutes! Need more staff during lunch rush. People walked out.`,
      tag: 'speed',
    });
  } else if (params.staffing === 'rush_ready') {
    reviews.push({
      id: 'rev-2',
      author: names[4],
      avatar: avatars[4],
      stars: 5,
      comment: `Lightning fast checkout! Ordered and had my food in 90 seconds flat.`,
      tag: 'speed',
    });
  } else {
    reviews.push({
      id: 'rev-2',
      author: names[4],
      avatar: avatars[4],
      stars: 4,
      comment: `Friendly team and standard wait times.`,
      tag: 'speed',
    });
  }

  // Review 3: Quality / Vibe feedback
  if (params.quality === 'premium') {
    reviews.push({
      id: 'rev-3',
      author: names[5],
      avatar: avatars[5],
      stars: 5,
      comment: `You can really taste the organic, fresh ingredients! Outstanding quality.`,
      tag: 'quality',
    });
  } else if (params.quality === 'budget') {
    reviews.push({
      id: 'rev-3',
      author: names[6],
      avatar: avatars[6],
      stars: 2,
      comment: `Tasted a little bland and cheap today. Hope they bring back the original recipe.`,
      tag: 'quality',
    });
  } else if (params.hasLoyalty) {
    reviews.push({
      id: 'rev-3',
      author: names[6],
      avatar: avatars[6],
      stars: 5,
      comment: `Love the digital loyalty points program! Already earned my free upgrade.`,
      tag: 'vibe',
    });
  } else {
    reviews.push({
      id: 'rev-3',
      author: names[6],
      avatar: avatars[6],
      stars: 4,
      comment: `Solid local spot. Will definitely be coming back again.`,
      tag: 'vibe',
    });
  }

  return reviews;
}
