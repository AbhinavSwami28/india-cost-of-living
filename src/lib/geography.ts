// Indian geography: States → Districts → Cities
// Covers major states with their top districts and cities

export interface GeoEntry {
  state: string;
  districts: {
    name: string;
    cities: string[];
  }[];
}

export const INDIAN_GEOGRAPHY: GeoEntry[] = [
  {
    state: "Andhra Pradesh",
    districts: [
      { name: "Visakhapatnam", cities: ["Visakhapatnam", "Anakapalle", "Bheemunipatnam"] },
      { name: "Krishna", cities: ["Vijayawada", "Machilipatnam", "Gudivada"] },
      { name: "Guntur", cities: ["Guntur", "Tenali", "Mangalagiri"] },
      { name: "East Godavari", cities: ["Rajahmundry", "Kakinada", "Amalapuram"] },
      { name: "Chittoor", cities: ["Tirupati", "Chittoor", "Madanapalle"] },
      { name: "Anantapur", cities: ["Anantapur", "Hindupur", "Dharmavaram"] },
      { name: "Kurnool", cities: ["Kurnool", "Nandyal", "Adoni"] },
    ],
  },
  {
    state: "Bihar",
    districts: [
      { name: "Patna", cities: ["Patna", "Danapur", "Phulwari Sharif"] },
      { name: "Gaya", cities: ["Gaya", "Bodh Gaya", "Sherghati"] },
      { name: "Muzaffarpur", cities: ["Muzaffarpur", "Sitamarhi", "Sheohar"] },
      { name: "Bhagalpur", cities: ["Bhagalpur", "Naugachhia", "Sultanganj"] },
      { name: "Purnia", cities: ["Purnia", "Banmankhi", "Kasba"] },
    ],
  },
  {
    state: "Chhattisgarh",
    districts: [
      { name: "Raipur", cities: ["Raipur", "Naya Raipur", "Arang"] },
      { name: "Durg", cities: ["Durg", "Bhilai", "Rajnandgaon"] },
      { name: "Bilaspur", cities: ["Bilaspur", "Korba", "Champa"] },
    ],
  },
  {
    state: "Delhi",
    districts: [
      { name: "New Delhi", cities: ["New Delhi", "Connaught Place", "Saket"] },
      { name: "South Delhi", cities: ["Hauz Khas", "Greater Kailash", "Lajpat Nagar"] },
      { name: "North Delhi", cities: ["Civil Lines", "Model Town", "Pitampura"] },
      { name: "East Delhi", cities: ["Preet Vihar", "Laxmi Nagar", "Mayur Vihar"] },
      { name: "West Delhi", cities: ["Rajouri Garden", "Janakpuri", "Dwarka"] },
      { name: "Central Delhi", cities: ["Karol Bagh", "Paharganj", "Chandni Chowk"] },
      { name: "Noida (UP)", cities: ["Noida", "Greater Noida", "Noida Extension"] },
      { name: "Gurgaon (Haryana)", cities: ["Gurgaon", "Sohna", "Manesar"] },
      { name: "Faridabad (Haryana)", cities: ["Faridabad", "Ballabhgarh", "Palwal"] },
      { name: "Ghaziabad (UP)", cities: ["Ghaziabad", "Indirapuram", "Vaishali"] },
    ],
  },
  {
    state: "Goa",
    districts: [
      { name: "North Goa", cities: ["Panaji", "Mapusa", "Calangute", "Porvorim"] },
      { name: "South Goa", cities: ["Margao", "Vasco da Gama", "Ponda"] },
    ],
  },
  {
    state: "Gujarat",
    districts: [
      { name: "Ahmedabad", cities: ["Ahmedabad", "Gandhinagar", "Sanand"] },
      { name: "Surat", cities: ["Surat", "Bardoli", "Navsari"] },
      { name: "Vadodara", cities: ["Vadodara", "Anand", "Bharuch"] },
      { name: "Rajkot", cities: ["Rajkot", "Morbi", "Gondal"] },
      { name: "Bhavnagar", cities: ["Bhavnagar", "Palitana", "Sihor"] },
      { name: "Jamnagar", cities: ["Jamnagar", "Dwarka", "Khambhalia"] },
      { name: "Kutch", cities: ["Bhuj", "Gandhidham", "Mundra"] },
    ],
  },
  {
    state: "Haryana",
    districts: [
      { name: "Gurgaon", cities: ["Gurgaon", "Sohna", "Manesar"] },
      { name: "Faridabad", cities: ["Faridabad", "Ballabhgarh", "Palwal"] },
      { name: "Ambala", cities: ["Ambala", "Panchkula", "Barara"] },
      { name: "Hisar", cities: ["Hisar", "Hansi", "Barwala"] },
      { name: "Karnal", cities: ["Karnal", "Panipat", "Samalkha"] },
      { name: "Rohtak", cities: ["Rohtak", "Jhajjar", "Bahadurgarh"] },
    ],
  },
  {
    state: "Jharkhand",
    districts: [
      { name: "Ranchi", cities: ["Ranchi", "Namkum", "Kanke"] },
      { name: "Jamshedpur", cities: ["Jamshedpur", "Adityapur", "Gamharia"] },
      { name: "Dhanbad", cities: ["Dhanbad", "Jharia", "Sindri"] },
      { name: "Bokaro", cities: ["Bokaro Steel City", "Chas", "Bermo"] },
    ],
  },
  {
    state: "Karnataka",
    districts: [
      { name: "Bangalore Urban", cities: ["Bangalore", "Whitefield", "Electronic City", "Yelahanka"] },
      { name: "Bangalore Rural", cities: ["Devanahalli", "Anekal", "Hoskote"] },
      { name: "Mysuru", cities: ["Mysuru", "Nanjangud", "Hunsur"] },
      { name: "Mangalore", cities: ["Mangalore", "Udupi", "Manipal"] },
      { name: "Hubli-Dharwad", cities: ["Hubli", "Dharwad", "Belgaum"] },
      { name: "Gulbarga", cities: ["Gulbarga", "Raichur", "Bidar"] },
    ],
  },
  {
    state: "Kerala",
    districts: [
      { name: "Thiruvananthapuram", cities: ["Thiruvananthapuram", "Neyyattinkara", "Attingal"] },
      { name: "Ernakulam", cities: ["Kochi", "Aluva", "Angamaly", "Perumbavoor"] },
      { name: "Kozhikode", cities: ["Kozhikode", "Vadakara", "Koyilandy"] },
      { name: "Thrissur", cities: ["Thrissur", "Chalakudy", "Kunnamkulam"] },
      { name: "Kollam", cities: ["Kollam", "Karunagappally", "Punalur"] },
      { name: "Kannur", cities: ["Kannur", "Thalassery", "Payyanur"] },
    ],
  },
  {
    state: "Madhya Pradesh",
    districts: [
      { name: "Bhopal", cities: ["Bhopal", "Sehore", "Vidisha"] },
      { name: "Indore", cities: ["Indore", "Dewas", "Ujjain"] },
      { name: "Jabalpur", cities: ["Jabalpur", "Katni", "Narsinghpur"] },
      { name: "Gwalior", cities: ["Gwalior", "Morena", "Datia"] },
    ],
  },
  {
    state: "Maharashtra",
    districts: [
      { name: "Mumbai City", cities: ["South Mumbai", "Lower Parel", "Bandra"] },
      { name: "Mumbai Suburban", cities: ["Andheri", "Borivali", "Malad", "Goregaon", "Kandivali"] },
      { name: "Thane", cities: ["Thane", "Navi Mumbai", "Kalyan", "Dombivli", "Bhiwandi"] },
      { name: "Pune", cities: ["Pune", "Pimpri-Chinchwad", "Hinjewadi", "Kothrud", "Wakad"] },
      { name: "Nagpur", cities: ["Nagpur", "Kamptee", "Hingna"] },
      { name: "Nashik", cities: ["Nashik", "Malegaon", "Sinnar"] },
      { name: "Aurangabad", cities: ["Aurangabad", "Jalna", "Parbhani"] },
      { name: "Kolhapur", cities: ["Kolhapur", "Sangli", "Ichalkaranji"] },
    ],
  },
  {
    state: "Odisha",
    districts: [
      { name: "Khordha", cities: ["Bhubaneswar", "Jatni", "Khordha"] },
      { name: "Cuttack", cities: ["Cuttack", "Choudwar", "Banki"] },
      { name: "Ganjam", cities: ["Berhampur", "Gopalpur", "Chatrapur"] },
    ],
  },
  {
    state: "Punjab",
    districts: [
      { name: "Ludhiana", cities: ["Ludhiana", "Khanna", "Jagraon"] },
      { name: "Amritsar", cities: ["Amritsar", "Ajnala", "Tarn Taran"] },
      { name: "Jalandhar", cities: ["Jalandhar", "Phagwara", "Nakodar"] },
      { name: "Patiala", cities: ["Patiala", "Rajpura", "Nabha"] },
      { name: "Mohali", cities: ["Mohali", "Zirakpur", "Kharar", "Chandigarh"] },
    ],
  },
  {
    state: "Rajasthan",
    districts: [
      { name: "Jaipur", cities: ["Jaipur", "Sanganer", "Amber"] },
      { name: "Jodhpur", cities: ["Jodhpur", "Pali", "Barmer"] },
      { name: "Udaipur", cities: ["Udaipur", "Chittorgarh", "Rajsamand"] },
      { name: "Kota", cities: ["Kota", "Bundi", "Baran"] },
      { name: "Ajmer", cities: ["Ajmer", "Pushkar", "Kishangarh"] },
      { name: "Bikaner", cities: ["Bikaner", "Sri Ganganagar", "Hanumangarh"] },
    ],
  },
  {
    state: "Tamil Nadu",
    districts: [
      { name: "Chennai", cities: ["Chennai", "Tambaram", "Avadi", "Ambattur"] },
      { name: "Coimbatore", cities: ["Coimbatore", "Tirupur", "Pollachi"] },
      { name: "Madurai", cities: ["Madurai", "Dindigul", "Theni"] },
      { name: "Tiruchirappalli", cities: ["Trichy", "Srirangam", "Thanjavur"] },
      { name: "Salem", cities: ["Salem", "Namakkal", "Erode"] },
      { name: "Tirunelveli", cities: ["Tirunelveli", "Nagercoil", "Thoothukudi"] },
      { name: "Vellore", cities: ["Vellore", "Ranipet", "Ambur"] },
    ],
  },
  {
    state: "Telangana",
    districts: [
      { name: "Hyderabad", cities: ["Hyderabad", "Secunderabad", "Kukatpally", "Gachibowli", "HITEC City"] },
      { name: "Rangareddy", cities: ["Shamshabad", "Miyapur", "Kondapur", "Manikonda"] },
      { name: "Warangal", cities: ["Warangal", "Kazipet", "Hanamkonda"] },
      { name: "Karimnagar", cities: ["Karimnagar", "Ramagundam", "Peddapalli"] },
      { name: "Medchal", cities: ["Medchal", "Kompally", "Alwal"] },
    ],
  },
  {
    state: "Uttar Pradesh",
    districts: [
      { name: "Lucknow", cities: ["Lucknow", "Gomti Nagar", "Hazratganj", "Aliganj"] },
      { name: "Noida", cities: ["Noida", "Greater Noida", "Noida Extension"] },
      { name: "Ghaziabad", cities: ["Ghaziabad", "Indirapuram", "Vaishali", "Raj Nagar"] },
      { name: "Kanpur", cities: ["Kanpur", "Panki", "Armapur"] },
      { name: "Agra", cities: ["Agra", "Firozabad", "Mathura"] },
      { name: "Varanasi", cities: ["Varanasi", "Ramnagar", "Sarnath"] },
      { name: "Prayagraj", cities: ["Prayagraj", "Naini", "Phaphamau"] },
      { name: "Meerut", cities: ["Meerut", "Modinagar", "Hapur"] },
    ],
  },
  {
    state: "Uttarakhand",
    districts: [
      { name: "Dehradun", cities: ["Dehradun", "Mussoorie", "Rishikesh"] },
      { name: "Haridwar", cities: ["Haridwar", "Roorkee", "Jwalapur"] },
      { name: "Nainital", cities: ["Haldwani", "Nainital", "Bhimtal"] },
    ],
  },
  {
    state: "West Bengal",
    districts: [
      { name: "Kolkata", cities: ["Kolkata", "Salt Lake", "New Town", "Rajarhat"] },
      { name: "Howrah", cities: ["Howrah", "Shibpur", "Liluah"] },
      { name: "North 24 Parganas", cities: ["Barasat", "Dum Dum", "Barrackpore"] },
      { name: "South 24 Parganas", cities: ["Baruipur", "Diamond Harbour", "Sonarpur"] },
      { name: "Darjeeling", cities: ["Siliguri", "Darjeeling", "Kalimpong"] },
    ],
  },
  {
    state: "Assam",
    districts: [
      { name: "Kamrup Metropolitan", cities: ["Guwahati", "Dispur", "Noonmati"] },
      { name: "Jorhat", cities: ["Jorhat", "Titabar", "Mariani"] },
      { name: "Dibrugarh", cities: ["Dibrugarh", "Tinsukia", "Duliajan"] },
    ],
  },
  {
    state: "Himachal Pradesh",
    districts: [
      { name: "Shimla", cities: ["Shimla", "Solan", "Kasauli"] },
      { name: "Kangra", cities: ["Dharamshala", "Kangra", "Palampur"] },
      { name: "Mandi", cities: ["Mandi", "Sundernagar", "Jogindernagar"] },
    ],
  },
  {
    state: "Jammu & Kashmir",
    districts: [
      { name: "Srinagar", cities: ["Srinagar", "Ganderbal", "Budgam"] },
      { name: "Jammu", cities: ["Jammu", "Udhampur", "Kathua"] },
    ],
  },
];

export function getStates(): string[] {
  return INDIAN_GEOGRAPHY.map((g) => g.state).sort();
}

export function getDistricts(state: string): string[] {
  const entry = INDIAN_GEOGRAPHY.find((g) => g.state === state);
  return entry ? entry.districts.map((d) => d.name) : [];
}

export function getCities(state: string, district: string): string[] {
  const entry = INDIAN_GEOGRAPHY.find((g) => g.state === state);
  if (!entry) return [];
  const dist = entry.districts.find((d) => d.name === district);
  return dist ? dist.cities : [];
}
