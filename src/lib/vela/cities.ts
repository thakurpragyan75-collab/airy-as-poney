export type Staple = { item: string; price: number; unit: string };
export type Appliance = {
  item: string;
  fair: number;
  cheap: number;
  months: number[];
  window: string;
};
export type Season = { months: number[]; title: string; detail: string };

export type City = {
  id: string;
  name: string;
  country: string;
  currency: string;
  tightHousing: boolean;
  groceryFair: number;
  transitFair: number;
  blurb: string;
  cheapDay: string;
  market: string;
  staples: Staple[];
  appliances: Appliance[];
  seasons: Season[];
};

export const CITIES: City[] = [
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    currency: "INR",
    tightHousing: true,
    groceryFair: 5200,
    transitFair: 1800,
    blurb:
      "Rent and eating out move a Mumbai plan more than gadgets. October and November are when fans, phones, and kitchen machines usually drop.",
    cheapDay: "Wednesday",
    market:
      "Early sabzi markets, before 9, beat evening kirana prices. Local trains cost less than app cabs for anything you do twice a day.",
    staples: [
      { item: "Rice", price: 62, unit: "per kg" },
      { item: "Milk", price: 58, unit: "per litre" },
      { item: "Eggs", price: 90, unit: "per dozen" },
      { item: "Local transit", price: 20, unit: "a short ride" },
      { item: "Mobile data", price: 350, unit: "a month" },
      { item: "Filter coffee", price: 40, unit: "a cup, standing" },
    ],
    appliances: [
      { item: "Ceiling fan", fair: 2800, cheap: 1900, months: [10, 11], window: "Festive sales" },
      { item: "Mixer grinder", fair: 4800, cheap: 3200, months: [10, 11, 1], window: "Festive and January clearance" },
      { item: "Phone", fair: 22000, cheap: 16000, months: [10, 11, 1], window: "Festive and new-year stock" },
      { item: "Refrigerator", fair: 28000, cheap: 22000, months: [10, 11], window: "Pre-Diwali appliance weeks" },
    ],
    seasons: [
      { months: [1], title: "January clearance", detail: "Winter stock and wedding-season leftovers. Good for small appliances, poor for travel." },
      { months: [3], title: "Year-end money chores", detail: "Tax proofs, insurance renewals, and school fees cluster. Do not plan a big joy purchase here." },
      { months: [6, 7], title: "Monsoon hold", detail: "Delay electronics. Damp stock and fewer genuine discounts. Rain gear is the thing that is actually useful." },
      { months: [10, 11], title: "Festive appliance window", detail: "The widest gap between fair and cheap on fans, phones, mixers, and fridges. Travel and gold run the other way." },
      { months: [12], title: "Travel premium", detail: "Trains and flights thicken. Groceries for gatherings spike. Appliances are already past their best week." },
    ],
  },
  {
    id: "delhi",
    name: "Delhi",
    country: "India",
    currency: "INR",
    tightHousing: true,
    groceryFair: 4800,
    transitFair: 1600,
    blurb:
      "Winter air and summer heat both create appliance rushes. The calm buy is late January or the October festive window, not the week a heat wave starts.",
    cheapDay: "Tuesday",
    market:
      "Weekly haats undercut supermarket produce if you go at opening. Metro passes beat autos for a commute you already know.",
    staples: [
      { item: "Wheat flour", price: 48, unit: "per kg" },
      { item: "Milk", price: 56, unit: "per litre" },
      { item: "Eggs", price: 84, unit: "per dozen" },
      { item: "Metro ride", price: 30, unit: "a short hop" },
      { item: "Mobile data", price: 300, unit: "a month" },
      { item: "Chai", price: 20, unit: "a cup" },
    ],
    appliances: [
      { item: "Air cooler", fair: 9000, cheap: 6500, months: [2, 3], window: "Before the heat, not during it" },
      { item: "Room heater", fair: 3500, cheap: 2400, months: [9, 1], window: "Early autumn or January leftover" },
      { item: "Phone", fair: 20000, cheap: 15000, months: [10, 11, 1], window: "Festive and January" },
      { item: "Washing machine", fair: 24000, cheap: 18500, months: [10, 11], window: "Festive appliance weeks" },
    ],
    seasons: [
      { months: [1], title: "Republic-week and winter clearance", detail: "Heaters and winter clothes drop. A bad time to discover you need one tonight." },
      { months: [3, 4], title: "Pre-summer", detail: "Coolers are cheaper before the first hot week. After that, price and stock both worsen." },
      { months: [10, 11], title: "Festive window", detail: "Phones and white goods. Weddings also pull cash out of households — name that spend or it will disguise itself as shopping." },
      { months: [12], title: "Smog-season indoors", detail: "Food delivery and cafes climb because people stay in. That is a pull, not a season you have to fund." },
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    country: "India",
    currency: "INR",
    tightHousing: true,
    groceryFair: 5000,
    transitFair: 2200,
    blurb:
      "Rent and app cabs quietly outrun groceries. The festive window still matters for machines, but the weekly leak is usually a cab home and a branded coffee.",
    cheapDay: "Thursday",
    market:
      "Neighbourhood sandhai mornings are cheaper than app grocery for vegetables. A bus pass or metro, if your line exists, beats two cabs a day.",
    staples: [
      { item: "Rice", price: 64, unit: "per kg" },
      { item: "Milk", price: 52, unit: "per litre" },
      { item: "Eggs", price: 88, unit: "per dozen" },
      { item: "Bus or metro", price: 30, unit: "a commute hop" },
      { item: "Mobile data", price: 350, unit: "a month" },
      { item: "Filter coffee", price: 30, unit: "a cup" },
    ],
    appliances: [
      { item: "Mixer grinder", fair: 4600, cheap: 3100, months: [10, 11, 1], window: "Festive and January" },
      { item: "Phone", fair: 23000, cheap: 17000, months: [10, 11], window: "Festive sales" },
      { item: "Induction cooktop", fair: 3200, cheap: 2100, months: [1, 10], window: "January or pre-festival" },
      { item: "Laptop", fair: 62000, cheap: 52000, months: [10, 11, 8], window: "Festive or end-of-quarter stock" },
    ],
    seasons: [
      { months: [1], title: "Quiet clearance", detail: "Good for kitchen kit. Rents do not join the sale." },
      { months: [4, 5], title: "Summer hiring season", detail: "New jobs tempt a new phone and a deposit. Separate the deposit from joy before you celebrate." },
      { months: [8], title: "Back-to-campus", detail: "Laptops and hostels. If you are not a student, this is not your discount month." },
      { months: [10, 11], title: "Festive appliance window", detail: "The real gap on phones and kitchen machines." },
    ],
  },
  {
    id: "chennai",
    name: "Chennai",
    country: "India",
    currency: "INR",
    tightHousing: false,
    groceryFair: 4500,
    transitFair: 1400,
    blurb:
      "Heat makes fans and fridges emotional purchases. Buy them in the festive window or January, not on the worst afternoon of May.",
    cheapDay: "Friday",
    market: "Uzhavar sandhai stalls are the price check for vegetables. Evening supermarket runs are the expensive version of the same list.",
    staples: [
      { item: "Rice", price: 58, unit: "per kg" },
      { item: "Milk", price: 50, unit: "per litre" },
      { item: "Eggs", price: 78, unit: "per dozen" },
      { item: "Bus ride", price: 15, unit: "a short hop" },
      { item: "Mobile data", price: 280, unit: "a month" },
      { item: "Filter coffee", price: 25, unit: "a cup" },
    ],
    appliances: [
      { item: "Ceiling fan", fair: 2600, cheap: 1700, months: [10, 11, 1], window: "Festive or January" },
      { item: "Mixer grinder", fair: 4200, cheap: 2900, months: [10, 11], window: "Festive weeks" },
      { item: "Refrigerator", fair: 26000, cheap: 20500, months: [10, 11], window: "Before Deepavali peaks" },
      { item: "Phone", fair: 18000, cheap: 13500, months: [10, 11, 1], window: "Festive and new year" },
    ],
    seasons: [
      { months: [1], title: "Pongal and clearance", detail: "Family groceries spike. Small appliances left from December are the bargain, not the feast." },
      { months: [4, 5], title: "Peak heat", detail: "Fans sell at fear prices. If yours works, wait." },
      { months: [10, 11], title: "Deepavali window", detail: "The city's real appliance season. Gold and clothes are the opposite — they get louder, not cheaper in a useful way." },
      { months: [11, 12], title: "Monsoon watch", detail: "Flood weeks disrupt markets. Do not count on a same-week delivery discount." },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    country: "India",
    currency: "INR",
    tightHousing: false,
    groceryFair: 4400,
    transitFair: 1500,
    blurb:
      "Food is generous and easy to overfund. The plan usually leaks at biryani nights and app delivery, not at the electricity bill.",
    cheapDay: "Sunday",
    market: "Morning rythu bazaars are the cheap produce hour. Late-night delivery is a different budget wearing the same hunger.",
    staples: [
      { item: "Rice", price: 60, unit: "per kg" },
      { item: "Milk", price: 54, unit: "per litre" },
      { item: "Eggs", price: 80, unit: "per dozen" },
      { item: "Bus or metro", price: 20, unit: "a short hop" },
      { item: "Mobile data", price: 300, unit: "a month" },
      { item: "Tea", price: 15, unit: "a cup" },
    ],
    appliances: [
      { item: "Mixer grinder", fair: 4300, cheap: 2900, months: [10, 11], window: "Festive sales" },
      { item: "Air cooler", fair: 8500, cheap: 6200, months: [2, 3], window: "Before summer" },
      { item: "Phone", fair: 19000, cheap: 14500, months: [10, 11, 1], window: "Festive and January" },
      { item: "Television", fair: 32000, cheap: 25000, months: [10, 11], window: "Festive electronics" },
    ],
    seasons: [
      { months: [1], title: "January quiet", detail: "Decent for electronics leftovers. Weddings may still be pulling gifts out of joy." },
      { months: [3, 4], title: "Pre-summer", detail: "Coolers and servicing. Buying in May is the impatient price." },
      { months: [6, 7], title: "Rains", detail: "Commute apps surge on wet evenings. That belongs in transit or delivery, not in a mystery." },
      { months: [10, 11], title: "Festive window", detail: "Best typical gap on phones and televisions." },
    ],
  },
  {
    id: "kolkata",
    name: "Kolkata",
    country: "India",
    currency: "INR",
    tightHousing: false,
    groceryFair: 4000,
    transitFair: 1100,
    blurb:
      "The city is gentler on rent than Mumbai and harsher on festival cash. Durga Puja is a season you should name, or it will empty joy and still feel like it was not spending.",
    cheapDay: "Thursday",
    market: "Municipal markets in the morning are the staple price. Puja-week hawking is theatre, not a discount.",
    staples: [
      { item: "Rice", price: 54, unit: "per kg" },
      { item: "Milk", price: 52, unit: "per litre" },
      { item: "Eggs", price: 78, unit: "per dozen" },
      { item: "Bus or metro", price: 15, unit: "a short hop" },
      { item: "Mobile data", price: 250, unit: "a month" },
      { item: "Tea", price: 10, unit: "a cup" },
    ],
    appliances: [
      { item: "Ceiling fan", fair: 2400, cheap: 1600, months: [1, 10], window: "January or pre-Puja" },
      { item: "Mixer grinder", fair: 3900, cheap: 2700, months: [1, 8], window: "New year or late monsoon sales" },
      { item: "Phone", fair: 17000, cheap: 13000, months: [10, 1], window: "October sales or January" },
      { item: "Refrigerator", fair: 24000, cheap: 19000, months: [10, 1], window: "Pre-Puja or winter clearance" },
    ],
    seasons: [
      { months: [1], title: "Winter clearance", detail: "Small appliances and woollens. A calm month if Puja did not already overdraw you." },
      { months: [3], title: "Year-end papers", detail: "Insurance and tax. Keep joy flat." },
      { months: [9, 10], title: "Durga Puja", detail: "Clothes, eating out, and gifts. Give this a named envelope or it will pose as 'nothing much'." },
      { months: [10, 11], title: "Post-Puja appliance quiet", detail: "Some stock is discounted because festival demand already happened. Useful if you waited." },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    currency: "INR",
    tightHousing: false,
    groceryFair: 3600,
    transitFair: 900,
    blurb:
      "Living costs sit below the big metros. The danger is assuming that means treats are free. Wedding season is the expensive weather.",
    cheapDay: "Sunday",
    market: "Johari and neighbourhood bazaars reward a list. Tourist strips do not. Morning mandis set the real vegetable price.",
    staples: [
      { item: "Wheat flour", price: 42, unit: "per kg" },
      { item: "Milk", price: 54, unit: "per litre" },
      { item: "Eggs", price: 76, unit: "per dozen" },
      { item: "City bus", price: 15, unit: "a short hop" },
      { item: "Mobile data", price: 250, unit: "a month" },
      { item: "Tea", price: 10, unit: "a cup" },
    ],
    appliances: [
      { item: "Air cooler", fair: 7800, cheap: 5600, months: [2, 3], window: "Before the hot months" },
      { item: "Mixer grinder", fair: 3600, cheap: 2500, months: [10, 1], window: "Festive or January" },
      { item: "Phone", fair: 16000, cheap: 12000, months: [10, 11], window: "Festive sales" },
      { item: "Ceiling fan", fair: 2200, cheap: 1500, months: [10, 1], window: "Festive or clearance" },
    ],
    seasons: [
      { months: [1, 2], title: "Wedding spillover", detail: "Gifts and clothes. Name a gift cap before the invitations do it for you." },
      { months: [4, 5], title: "Dry heat", detail: "Coolers bought now are convenience prices." },
      { months: [10, 11], title: "Festive and wedding overlap", detail: "Appliances are cheaper. Social spending is not. Split those urges." },
      { months: [12], title: "Tourist premium", detail: "Cafes in the old city price for visitors. Eating two streets away is the same meal." },
    ],
  },
  {
    id: "new-york",
    name: "New York",
    country: "United States",
    currency: "USD",
    tightHousing: true,
    groceryFair: 480,
    transitFair: 140,
    blurb:
      "Housing dominates even a strong salary. Appliances wait for late November or January. Weekday delivery is the leak that pretends to be a personality.",
    cheapDay: "Tuesday",
    market:
      "A weekly greenmarket near close-out undercuts midtown convenience stores. The unlimited MetroCard, or its current equivalent, beats a ride-hail habit.",
    staples: [
      { item: "Bread", price: 4, unit: "a loaf" },
      { item: "Milk", price: 5, unit: "a half gallon" },
      { item: "Eggs", price: 5, unit: "a dozen" },
      { item: "Subway ride", price: 3, unit: "a ride" },
      { item: "Phone plan", price: 50, unit: "a month, basic" },
      { item: "Deli coffee", price: 3, unit: "a cup" },
    ],
    appliances: [
      { item: "Coffee machine", fair: 180, cheap: 110, months: [1, 11], window: "January or Black Friday week" },
      { item: "Air conditioner", fair: 450, cheap: 320, months: [9, 1], window: "End of summer or January" },
      { item: "Phone", fair: 900, cheap: 700, months: [11, 1], window: "Late November or new year" },
      { item: "Vacuum", fair: 280, cheap: 180, months: [11, 1], window: "Holiday sales" },
    ],
    seasons: [
      { months: [1], title: "Winter clearance", detail: "Best quiet window for machines. Heating bills are the thing that is not on sale." },
      { months: [2, 3], title: "Tax season", detail: "A refund is not a bonus. If one arrives, the vault has first claim." },
      { months: [8, 9], title: "Back to routine", detail: "Leases turn over. Moving costs and broker fees belong in needs before any new sofa." },
      { months: [11], title: "Late-November sales", detail: "The real appliance gap. Travel that week is the expensive cousin." },
      { months: [12], title: "Holiday cash", detail: "Gifts, taxis, and dinners. Cap them in October or December will feel like a theft." },
    ],
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "United States",
    currency: "USD",
    tightHousing: true,
    groceryFair: 420,
    transitFair: 100,
    blurb:
      "Winter is an indoor-spending season: delivery, heat, and cabin restlessness. Buy heaters and coats before October, not during the first freeze.",
    cheapDay: "Wednesday",
    market: "Neighbourhood grocers away from the Loop are the staple price. The CTA beats rides once the wind is no longer an excuse.",
    staples: [
      { item: "Bread", price: 3.5, unit: "a loaf" },
      { item: "Milk", price: 4, unit: "a gallon" },
      { item: "Eggs", price: 4, unit: "a dozen" },
      { item: "Train ride", price: 2.5, unit: "a ride" },
      { item: "Phone plan", price: 45, unit: "a month" },
      { item: "Diner coffee", price: 3, unit: "a cup" },
    ],
    appliances: [
      { item: "Space heater", fair: 80, cheap: 45, months: [8, 9], window: "Before winter, not during it" },
      { item: "Humidifier", fair: 60, cheap: 35, months: [1, 9], window: "January clearance or early fall" },
      { item: "Phone", fair: 850, cheap: 650, months: [11], window: "Late November" },
      { item: "Cookware set", fair: 200, cheap: 120, months: [1, 11], window: "January or holiday sales" },
    ],
    seasons: [
      { months: [1], title: "Deep-winter sales", detail: "Machines drop. Mood-spending on delivery climbs. Watch the pull, not the flyer." },
      { months: [5], title: "Memorial weekend", detail: "A smaller appliance window. Travel starts to cost more." },
      { months: [9], title: "Pre-winter", detail: "The honest time for heat and coats." },
      { months: [11], title: "Late-November sales", detail: "Best general discount week. Do not fund it with the vault." },
    ],
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    currency: "GBP",
    tightHousing: true,
    groceryFair: 280,
    transitFair: 140,
    blurb:
      "Rent and transport set the plan. January sales are the city's real appliance season. December markets are priced for visitors and moods.",
    cheapDay: "Monday",
    market:
      "A weekly street market near closing is cheaper than a convenience chain. An Oyster or contactless cap beats black cabs for the commute you already have.",
    staples: [
      { item: "Bread", price: 1.4, unit: "a loaf" },
      { item: "Milk", price: 1.3, unit: "per litre-plus" },
      { item: "Eggs", price: 3, unit: "a dozen" },
      { item: "Tube hop", price: 2.8, unit: "a short ride" },
      { item: "SIM data", price: 15, unit: "a month" },
      { item: "Cafe tea", price: 3, unit: "a cup" },
    ],
    appliances: [
      { item: "Kettle and toaster", fair: 50, cheap: 28, months: [1, 11], window: "January or Black Friday" },
      { item: "Heater", fair: 40, cheap: 25, months: [1, 9], window: "January leftover or early autumn" },
      { item: "Phone", fair: 700, cheap: 520, months: [11, 1], window: "Late November or January" },
      { item: "Vacuum", fair: 220, cheap: 140, months: [1, 11], window: "January sales" },
    ],
    seasons: [
      { months: [1], title: "January sales", detail: "The clearest cheap window for home kit. Gym signups are the decoy." },
      { months: [4], title: "New tax year", detail: "Allowances reset. A good month to raise the vault, not the wardrobe." },
      { months: [7], title: "Summer sales", detail: "Clothes more than machines. Travel peaks." },
      { months: [11], title: "Black Friday week", detail: "Useful for a named appliance. Useless as a reason to browse." },
      { months: [12], title: "Christmas cash", detail: "Food and gifts. Markets in the centre are not a grocery strategy." },
    ],
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    currency: "EUR",
    tightHousing: true,
    groceryFair: 260,
    transitFair: 60,
    blurb:
      "Groceries can stay calm if you use discounters. The leak is weekends: dinners, clubs, and Flix-shaped trips that never get a name.",
    cheapDay: "Tuesday",
    market: "Discounters set the staple price. Weekly markets are for produce you will actually cook, not for the mood.",
    staples: [
      { item: "Bread", price: 2, unit: "a loaf" },
      { item: "Milk", price: 1.2, unit: "per litre" },
      { item: "Eggs", price: 3, unit: "ten eggs" },
      { item: "Transit ticket", price: 3.2, unit: "a short ride" },
      { item: "Mobile plan", price: 15, unit: "a month" },
      { item: "Coffee to go", price: 3.5, unit: "a cup" },
    ],
    appliances: [
      { item: "Coffee machine", fair: 120, cheap: 70, months: [1, 11], window: "January or late November" },
      { item: "Fan", fair: 40, cheap: 25, months: [1, 9], window: "January or end of summer" },
      { item: "Phone", fair: 650, cheap: 480, months: [11, 1], window: "Late November or January" },
      { item: "Desk lamp", fair: 45, cheap: 25, months: [1], window: "January clearance" },
    ],
    seasons: [
      { months: [1], title: "Winterschlussverkauf", detail: "The traditional cheap window. Use it for a named object." },
      { months: [7, 8], title: "Summer quiet", detail: "City empties. Some renters sublet. Travel gets pricey. Appliances are ordinary." },
      { months: [11], title: "Late-November sales", detail: "Electronics, not groceries." },
      { months: [12], title: "Christmas markets", detail: "Glühwein is a joy leak with a costume. Cap the month before the first mug." },
    ],
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    currency: "EUR",
    tightHousing: true,
    groceryFair: 320,
    transitFair: 80,
    blurb:
      "Cafes are the culturally approved leak. The January soldes are the appliance season. August is expensive to leave and oddly cheap to stay.",
    cheapDay: "Wednesday",
    market: "A neighbourhood market in the last hour undercuts the same fruit on a terrace. The Navigo pass is the commute. Taxis are the story you tell yourself.",
    staples: [
      { item: "Baguette", price: 1.3, unit: "each" },
      { item: "Milk", price: 1.2, unit: "per litre" },
      { item: "Eggs", price: 3.5, unit: "a dozen" },
      { item: "Metro ticket", price: 2.2, unit: "a ride" },
      { item: "Mobile plan", price: 15, unit: "a month" },
      { item: "Cafe espresso", price: 2.5, unit: "standing at the counter" },
    ],
    appliances: [
      { item: "Coffee machine", fair: 150, cheap: 90, months: [1, 6], window: "January or summer soldes" },
      { item: "Fan", fair: 50, cheap: 30, months: [1, 8], window: "January or end of heat" },
      { item: "Phone", fair: 700, cheap: 520, months: [1, 11], window: "Soldes or late November" },
      { item: "Vacuum", fair: 200, cheap: 130, months: [1, 6], window: "Soldes" },
    ],
    seasons: [
      { months: [1, 2], title: "Winter soldes", detail: "The regulated sale window. Best for home kit and coats." },
      { months: [6, 7], title: "Summer soldes", detail: "Second real window. Travel collides with it — do not mix the two budgets." },
      { months: [8], title: "August stillness", detail: "Many shops close. Staying put can be the cheap month if you are not on a train south." },
      { months: [12], title: "Fêtes", detail: "Meals and gifts. Terrace prices are not your grocery fair." },
    ],
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    currency: "SGD",
    tightHousing: true,
    groceryFair: 420,
    transitFair: 100,
    blurb:
      "Hawker food is the fair price and cafes are the costume. The Great Singapore Sale and 11.11 are the machine windows. Air-conditioning is a need, not a luxury speech.",
    cheapDay: "Monday",
    market: "Hawker centres are the staple meal. Supermarkets discount nearer closing. The MRT beats a Grab for anything that is not raining sideways.",
    staples: [
      { item: "Rice", price: 4, unit: "per kg" },
      { item: "Milk", price: 3.5, unit: "a litre" },
      { item: "Eggs", price: 4, unit: "a dozen" },
      { item: "MRT ride", price: 1.5, unit: "a short hop" },
      { item: "Mobile plan", price: 20, unit: "a month" },
      { item: "Hawker meal", price: 6, unit: "a plate" },
    ],
    appliances: [
      { item: "Fan", fair: 80, cheap: 50, months: [6, 9, 11], window: "GSS spillover, 9.9, or 11.11" },
      { item: "Rice cooker", fair: 90, cheap: 55, months: [11, 6], window: "11.11 or mid-year sale" },
      { item: "Phone", fair: 1100, cheap: 860, months: [11, 6], window: "11.11 or Great Singapore Sale" },
      { item: "Air purifier", fair: 300, cheap: 190, months: [11, 3], window: "11.11 or haze-before, not haze-during" },
    ],
    seasons: [
      { months: [3], title: "Pre-haze", detail: "If you need a purifier, buy before the haze headlines. During them, stock is the expensive kind." },
      { months: [6, 7], title: "Great Singapore Sale", detail: "A real window for named electronics. Malls are built to widen it into things you did not name." },
      { months: [9], title: "9.9", detail: "Online appliance dips. Compare with a store price before trusting the strikethrough." },
      { months: [11], title: "11.11", detail: "Often the deepest typical gap on phones and small machines." },
      { months: [12], title: "Year-end travel", detail: "Flights out of the island jump. School holidays and rain. Not an appliance month." },
    ],
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    currency: "AED",
    tightHousing: true,
    groceryFair: 900,
    transitFair: 300,
    blurb:
      "Housing and weekends set the plan. Dubai Shopping Festival and the late-November global sale week are the machine windows. Summer is when the city discounts what the heat emptied.",
    cheapDay: "Tuesday",
    market:
      "Carrefour and union co-ops anchor staples. Brunch is a joy category pretending to be a meal. The metro covers more than the taxi habit admits.",
    staples: [
      { item: "Rice", price: 8, unit: "per kg" },
      { item: "Milk", price: 7, unit: "a litre" },
      { item: "Eggs", price: 12, unit: "a dozen" },
      { item: "Metro ride", price: 5, unit: "a short hop" },
      { item: "Mobile plan", price: 120, unit: "a month" },
      { item: "Cafeteria karak", price: 2, unit: "a cup" },
    ],
    appliances: [
      { item: "Air fryer", fair: 350, cheap: 220, months: [1, 11], window: "DSF or late November" },
      { item: "Vacuum", fair: 500, cheap: 320, months: [1, 11], window: "Festival sales" },
      { item: "Phone", fair: 2800, cheap: 2100, months: [11, 1], window: "White Friday or DSF" },
      { item: "Television", fair: 2200, cheap: 1600, months: [11, 1], window: "Festival electronics" },
    ],
    seasons: [
      { months: [1, 2], title: "Dubai Shopping Festival", detail: "The local appliance season. Also a tourist season — restaurants do not get cheaper just because malls do." },
      { months: [7, 8], title: "Summer lull", detail: "Some hospitality and fitness deals because people leave. Electronics are uneven. Rent negotiations happen now if your contract allows." },
      { months: [11], title: "White Friday", detail: "The imported sale weekend. Useful with a list written in October." },
      { months: [12], title: "High season", detail: "Flights and tables surge. Not the month to discover your dream is a trip." },
    ],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    currency: "JPY",
    tightHousing: true,
    groceryFair: 42000,
    transitFair: 10000,
    blurb:
      "Small kitchens and convenience stores make food look cheap per visit and large per month. New life in spring and the year-end sales are the two honest windows.",
    cheapDay: "Thursday",
    market:
      "Supermarkets discount prepared food after 7. Convenience stores are the expensive version of the same hunger. A commuter pass beats IC-card surprises.",
    staples: [
      { item: "Rice", price: 700, unit: "per kg" },
      { item: "Milk", price: 230, unit: "a litre" },
      { item: "Eggs", price: 300, unit: "a pack of ten" },
      { item: "Metro hop", price: 180, unit: "a short ride" },
      { item: "Mobile plan", price: 3000, unit: "a month, basic" },
      { item: "Convenience coffee", price: 150, unit: "a can" },
    ],
    appliances: [
      { item: "Rice cooker", fair: 18000, cheap: 11000, months: [1, 3], window: "New-year sales or spring life" },
      { item: "Fan", fair: 8000, cheap: 4500, months: [9, 1], window: "End of summer or January" },
      { item: "Phone", fair: 90000, cheap: 65000, months: [1, 3], window: "New year or spring model shift" },
      { item: "Microwave", fair: 15000, cheap: 9000, months: [1, 7], window: "January or mid-year clearance" },
    ],
    seasons: [
      { months: [1], title: "New-year sales", detail: "Fukubukuro season is mostly noise. Plain clearance on last year's machines is the signal." },
      { months: [3, 4], title: "New life", detail: "Moves, deposits, and starter appliances. If you are not moving, some starter kits still get discounted." },
      { months: [7], title: "Summer bonuses", detail: "A bonus is a vault event first. Retail knows it is coming." },
      { months: [12], title: "Year-end", detail: "Bonenkai dinners and gifts. Travel is packed. Set the cap in November." },
    ],
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    currency: "AUD",
    tightHousing: true,
    groceryFair: 450,
    transitFair: 160,
    blurb:
      "Rent and weekends at the coast set the plan. Boxing Day and mid-year EOFY sales are the machine windows. Summer is when joy disguises itself as 'being outside'.",
    cheapDay: "Tuesday",
    market: "Growers' markets near the end of the morning undercut the duopoly on produce. An Opal cap beats rideshares for the commute.",
    staples: [
      { item: "Bread", price: 3.5, unit: "a loaf" },
      { item: "Milk", price: 2, unit: "a litre" },
      { item: "Eggs", price: 6, unit: "a dozen" },
      { item: "Opal hop", price: 4, unit: "a short ride" },
      { item: "Mobile plan", price: 35, unit: "a month" },
      { item: "Flat white", price: 5, unit: "a cup" },
    ],
    appliances: [
      { item: "Fan", fair: 80, cheap: 45, months: [12, 6], window: "Boxing Day or EOFY" },
      { item: "Heater", fair: 90, cheap: 50, months: [6, 8], window: "EOFY or late winter" },
      { item: "Phone", fair: 1400, cheap: 1000, months: [6, 11], window: "EOFY or November" },
      { item: "BBQ", fair: 400, cheap: 250, months: [6, 12], window: "EOFY or Boxing Day" },
    ],
    seasons: [
      { months: [1], title: "Post-Christmas quiet", detail: "Leftover sales fade fast. Back-to-school competes for cash if you have children." },
      { months: [6], title: "EOFY sales", detail: "The most reliable appliance window, built around the tax year. A good month to fund the vault with what you did not buy." },
      { months: [11], title: "Black Friday import", detail: "Useful with one item on a list." },
      { months: [12], title: "Summer and Boxing Day", detail: "Boxing Day is the second window. The weeks before it are parties, travel, and full prices." },
    ],
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    currency: "KES",
    tightHousing: false,
    groceryFair: 14000,
    transitFair: 5000,
    blurb:
      "Matatu fares and airtime move weekly. Formal appliance sales cluster near holidays and Black Friday imports. The leak is often many small M-Pesa moments that never become a line.",
    cheapDay: "Saturday",
    market: "Wakulima and neighbourhood markets in the morning beat supermarket produce. A monthly transit plan beats uncounted matatu coins if your route is stable.",
    staples: [
      { item: "Maize flour", price: 180, unit: "2 kg" },
      { item: "Milk", price: 70, unit: "a half litre packet" },
      { item: "Eggs", price: 200, unit: "a dozen" },
      { item: "Matatu hop", price: 50, unit: "a short ride" },
      { item: "Airtime and data", price: 1000, unit: "a modest month" },
      { item: "Tea cafe", price: 50, unit: "a cup" },
    ],
    appliances: [
      { item: "Gas burner", fair: 4500, cheap: 3000, months: [11, 12], window: "Holiday sales" },
      { item: "Phone", fair: 25000, cheap: 18000, months: [11, 1], window: "November sales or January" },
      { item: "Iron", fair: 3000, cheap: 1800, months: [11, 1], window: "Holiday clearance" },
      { item: "Television", fair: 35000, cheap: 26000, months: [11], window: "Imported sale week" },
    ],
    seasons: [
      { months: [1], title: "School fees month", detail: "January cash is already spoken for in many households. Do not stack an appliance on it." },
      { months: [4], title: "Rains", detail: "Fares jump when roads slow. Log transport honestly for a month before calling it a crisis." },
      { months: [8], title: "Second school term", detail: "Another fee cluster. Joy should already be thin." },
      { months: [11, 12], title: "Holiday sales", detail: "The typical window for phones and home kit. Also travel upcountry, which is a separate envelope." },
    ],
  },
  {
    id: "lagos",
    name: "Lagos",
    country: "Nigeria",
    currency: "NGN",
    tightHousing: true,
    groceryFair: 85000,
    transitFair: 40000,
    blurb:
      "Fuel, power, and traffic decide more than cafe culture. Generator costs and data are needs. Detty December is a season with a costume and a real bill.",
    cheapDay: "Wednesday",
    market: "Mile 12 and neighbourhood markets in the morning are the staple price. Estate supermarkets are the convenience premium.",
    staples: [
      { item: "Rice", price: 1800, unit: "per kg" },
      { item: "Eggs", price: 2500, unit: "a crate portion" },
      { item: "Bread", price: 1500, unit: "a loaf" },
      { item: "Danfo hop", price: 500, unit: "a short ride" },
      { item: "Data", price: 5000, unit: "a modest month" },
      { item: "Pure water and soft drink", price: 500, unit: "a round" },
    ],
    appliances: [
      { item: "Rechargeable fan", fair: 45000, cheap: 32000, months: [11, 1], window: "November or January" },
      { item: "Gas cooker", fair: 80000, cheap: 60000, months: [11], window: "Year-end promos" },
      { item: "Phone", fair: 350000, cheap: 260000, months: [11, 1], window: "Black Friday import or January" },
      { item: "Inverter bulb kit", fair: 25000, cheap: 16000, months: [1, 11], window: "Promo weeks" },
    ],
    seasons: [
      { months: [1], title: "January reset", detail: "School fees and the bill for December. A bad month for a new phone unless the price is truly a leftover." },
      { months: [4, 5], title: "Heat and fuel", detail: "Power costs climb. Treat generator fuel as a utility, or the ledger will call you bad at joy." },
      { months: [9], title: "School resumption", detail: "Fees and uniforms. Name them." },
      { months: [11, 12], title: "Detty December", detail: "The social season. Give it an envelope in October. Appliance promos are real and easy to confuse with party cash." },
    ],
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    currency: "CAD",
    tightHousing: true,
    groceryFair: 430,
    transitFair: 150,
    blurb:
      "Rent and winter set the plan. Boxing Day is the local religion for machines. Presto beats rideshares the moment the novelty of the cold wears off.",
    cheapDay: "Tuesday",
    market: "No Frills and ethnic grocers set a fair staple price. The weekend market is produce plus a pastry you did not plan.",
    staples: [
      { item: "Bread", price: 3.5, unit: "a loaf" },
      { item: "Milk", price: 5, unit: "4 litres" },
      { item: "Eggs", price: 5, unit: "a dozen" },
      { item: "TTC ride", price: 3.3, unit: "a ride" },
      { item: "Phone plan", price: 45, unit: "a month" },
      { item: "Coffee", price: 4, unit: "a cup" },
    ],
    appliances: [
      { item: "Humidifier", fair: 70, cheap: 40, months: [12, 1], window: "Boxing Day or January" },
      { item: "Heater", fair: 60, cheap: 35, months: [9, 12], window: "Early fall or Boxing Day" },
      { item: "Phone", fair: 1100, cheap: 800, months: [11, 12], window: "November or Boxing Day" },
      { item: "Cookware", fair: 180, cheap: 90, months: [12, 1], window: "Boxing week" },
    ],
    seasons: [
      { months: [1], title: "Deep winter", detail: "Sales continue in thinner form. Heating is the bill. Delivery is the mood." },
      { months: [3, 4], title: "Tax refund weather", detail: "If a refund comes, it is vault fuel, not a new coat's permission." },
      { months: [9], title: "Back to school and leases", detail: "Deposits cluster. Keep joy quiet." },
      { months: [12], title: "Boxing Day", detail: "The clearest appliance window. The weeks before are gifts. Do not merge them." },
    ],
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    currency: "MXN",
    tightHousing: false,
    groceryFair: 4500,
    transitFair: 700,
    blurb:
      "Markets keep food fair if you use them. Buen Fin in November is the machine window. Weekends in Condesa prices are not the city's staple price.",
    cheapDay: "Wednesday",
    market: "Tianguis days are the produce plan. The metro is the commute. App cars are a joy line even when you call them transit.",
    staples: [
      { item: "Tortillas", price: 24, unit: "per kg" },
      { item: "Milk", price: 28, unit: "a litre" },
      { item: "Eggs", price: 50, unit: "a dozen" },
      { item: "Metro ride", price: 5, unit: "a ride" },
      { item: "Mobile data", price: 200, unit: "a month" },
      { item: "Coffee at a stand", price: 25, unit: "a cup" },
    ],
    appliances: [
      { item: "Blender", fair: 900, cheap: 550, months: [11, 1], window: "Buen Fin or January" },
      { item: "Fan", fair: 700, cheap: 450, months: [1, 11], window: "January or Buen Fin" },
      { item: "Phone", fair: 8000, cheap: 6000, months: [11], window: "Buen Fin" },
      { item: "Microwave", fair: 2500, cheap: 1700, months: [11, 5], window: "Buen Fin or Hot Sale" },
    ],
    seasons: [
      { months: [1], title: "Reyes and clearance", detail: "Gifts spill into January. Appliances left after Buen Fin can still be soft." },
      { months: [5], title: "Hot Sale", detail: "A mid-year online window. Compare the strikethrough with last month's real price." },
      { months: [9], title: "Independence week", detail: "Food and gatherings, not machines." },
      { months: [11], title: "Buen Fin", detail: "The city's main appliance season. Write the one item down before the weekend." },
      { months: [12], title: "Posadas", detail: "Dinners and travel. A named cap keeps it from eating the vault." },
    ],
  },
];

const byId = new Map(CITIES.map((c) => [c.id, c]));

export function getCity(id: string): City {
  return byId.get(id) ?? CITIES[0];
}

export function searchCities(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITIES;
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q),
  );
}
