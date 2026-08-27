import { CampaignMission, AchievementBadge, StudentProfile } from '../types';
import { 
  DEFAULT_BUSINESS_CARDS, DEFAULT_EVENT_CARDS, 
  DEFAULT_CHALLENGE_CARDS 
} from './defaultDecks';

export const CAMPAIGN_MISSIONS: CampaignMission[] = [
  {
    id: 'mission-1',
    levelNumber: 1,
    title: 'The Snack Stand Crisis',
    subtitle: 'Learn the Golden Formula: Rev − Exp = Profit',
    clientName: 'Maya Chen',
    clientRole: 'Courtyard Snack Kiosk Manager',
    clientAvatar: '🍿',
    storyDialog: 'Help! We sold $480 worth of snacks and drinks during lunch, but our costs jumped to $430 because of ingredient waste. I only took home $50! Can you help me test a smart fix to improve what remains?',
    business: DEFAULT_BUSINESS_CARDS[0], // Snack Stand ($480 Rev, $430 Exp, $50 Profit)
    event: DEFAULT_EVENT_CARDS[0], // Supply Chain Price Hike (+$40 Exp)
    challenge: DEFAULT_CHALLENGE_CARDS[0], // 20% Profit Margin Goal
    unlockRequirementLevel: 1,
    rewardXP: 300,
  },
  {
    id: 'mission-2',
    levelNumber: 2,
    title: 'Boba Rush Hour Surge',
    subtitle: 'Master Surge Demand & High Perishable Costs',
    clientName: 'Leo Alvarez',
    clientRole: 'Boba & Smoothie Bar Owner',
    clientAvatar: '🧋',
    storyDialog: 'After-school crowds are massive ($720 revenue!), but we are throwing away fresh pearls and sliced fruit every night ($630 expenses). A viral video just blew up—test which fix protects our quality and doubles our profit!',
    business: DEFAULT_BUSINESS_CARDS[3], // Boba Oasis ($720 Rev, $630 Exp, $90 Profit)
    event: DEFAULT_EVENT_CARDS[1], // Viral TikTok Trend (+$110 Rev, +$30 Exp)
    challenge: DEFAULT_CHALLENGE_CARDS[1], // Profit Surge Challenge (+$60 profit)
    unlockRequirementLevel: 2,
    rewardXP: 450,
  },
  {
    id: 'mission-3',
    levelNumber: 3,
    title: 'Screen Fix High-Tech Dilemma',
    subtitle: 'Service Labor & Expensive Replacement Parts',
    clientName: 'Devon Vance',
    clientRole: 'Speedy Tech Hub Lead Tech',
    clientAvatar: '📱',
    storyDialog: 'We fixed 20 cracked phone screens today ($620 revenue), but ordering screen parts individually with rush shipping cost us $530! We need a smarter strategy before next week’s midterms.',
    business: DEFAULT_BUSINESS_CARDS[2], // Screen Repair ($620 Rev, $530 Exp, $90 Profit)
    event: DEFAULT_EVENT_CARDS[4], // Tournament Rush Weekend (+$130 Rev, +$45 Exp)
    challenge: DEFAULT_CHALLENGE_CARDS[2], // Cost-Cutter Protocol
    unlockRequirementLevel: 3,
    rewardXP: 600,
  },
  {
    id: 'mission-4',
    levelNumber: 4,
    title: 'Spirit Merch Inventory Trap',
    subtitle: 'Balancing Bulk Printing with Unsold Stock Risk',
    clientName: 'Chloe Taylor',
    clientRole: 'Spirit Merch President',
    clientAvatar: '👕',
    storyDialog: 'Game day revenue was $950, but we spent $840 printing boxes of hoodies that did not sell in XXL and XS! We need a turnaround plan that prevents excess inventory while keeping hype high.',
    business: DEFAULT_BUSINESS_CARDS[1], // Spirit Merch ($950 Rev, $840 Exp, $110 Profit)
    event: DEFAULT_EVENT_CARDS[3], // Rival Apparel Cart (-$60 Rev)
    challenge: DEFAULT_CHALLENGE_CARDS[3], // Zero Layoff & Protect Quality
    unlockRequirementLevel: 4,
    rewardXP: 750,
  },
  {
    id: 'mission-5',
    levelNumber: 5,
    title: 'Boss Battle: The Gourmet Food Truck',
    subtitle: 'Ultimate Turnaround Challenge: Crisis Management',
    clientName: 'Chef Mateo Cruz',
    clientRole: 'Street Bites Food Truck Owner',
    clientAvatar: '🚚',
    storyDialog: 'This is it! High gas prices, rival taco trucks, and sudden rainy days have squeezed our margins to the limit ($540 Rev, $460 Exp). Build a flawless pitch and calculation to save our truck and earn the Master Tycoon trophy!',
    business: DEFAULT_BUSINESS_CARDS[4], // Campus Detail / Food Truck
    event: DEFAULT_EVENT_CARDS[2], // Rainstorm Slump (-$80 Rev, -$10 Exp)
    challenge: DEFAULT_CHALLENGE_CARDS[4], // Five Star Reputation Shield
    unlockRequirementLevel: 5,
    rewardXP: 1000,
  },
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-first-rescue',
    title: 'First Turnaround',
    description: 'Successfully complete your very first business turnaround mission.',
    icon: '🎯',
    category: 'career',
  },
  {
    id: 'badge-math-whiz',
    title: 'Math Maestro',
    description: 'Solve the revenue, expense, and profit equations with 100% calculation accuracy.',
    icon: '🧮',
    category: 'math',
  },
  {
    id: 'badge-margin-master',
    title: 'Margin Magician',
    description: 'Achieve a profit margin of 25% or higher on a rescued business.',
    icon: '📈',
    category: 'strategy',
  },
  {
    id: 'badge-cost-cutter',
    title: 'Cost Hacker',
    description: 'Reduce operating expenses by over $40 in a single round without harming revenue.',
    icon: '✂️',
    category: 'strategy',
  },
  {
    id: 'badge-pitch-pro',
    title: 'Pitch Legend',
    description: 'Draft a complete executive memo identifying Market Forces and Trade-offs.',
    icon: '🎤',
    category: 'strategy',
  },
  {
    id: 'badge-5star',
    title: 'Five-Star Consultant',
    description: 'Earn a perfect 5-Star score from the Board of Directors.',
    icon: '⭐',
    category: 'mastery',
  },
  {
    id: 'badge-boba-king',
    title: 'Boba Titan',
    description: 'Conquer the Boba Rush Hour surge event in Campaign Mode.',
    icon: '🧋',
    category: 'mastery',
  },
  {
    id: 'badge-tycoon-hero',
    title: 'Grand Tycoon',
    description: 'Complete all 5 Campaign Levels and accumulate over $1,000 in Career Profit.',
    icon: '👑',
    category: 'career',
  },
];

export const CONSULTANT_RANKS = [
  { level: 1, title: 'Junior Fixer', minXP: 0, avatarBadge: '🌱' },
  { level: 2, title: 'Profit Detective', minXP: 300, avatarBadge: '🔍' },
  { level: 3, title: 'Cost Hacker', minXP: 750, avatarBadge: '⚡' },
  { level: 4, title: 'Turnaround Specialist', minXP: 1350, avatarBadge: '💼' },
  { level: 5, title: 'Chief Profit Officer', minXP: 2100, avatarBadge: '🏆' },
  { level: 6, title: 'Grand Business Tycoon', minXP: 3100, avatarBadge: '👑' },
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Consultant Alex',
  avatar: '🦊',
  avatarColor: '#06b6d4',
  consultantRank: 'Junior Fixer',
  level: 1,
  xp: 0,
  careerProfit: 0,
  streak: 1,
  unlockedBadgeIds: [],
  completedMissionIds: [],
  missionStars: {},
};
