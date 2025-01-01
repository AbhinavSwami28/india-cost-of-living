export interface CityQuote {
  text: string;
  author: string;
  context?: string;
}

export const CITY_QUOTES: Record<string, CityQuote[]> = {
  mumbai: [
    { text: "Mumbai is a city of dreamers and doers. If you can survive here, you can survive anywhere.", author: "Popular saying" },
    { text: "The spirit of Mumbai — the city may flood, the trains may stop, but the next morning, Mumbai goes back to work.", author: "Common tribute" },
    { text: "In Bombay, the weights and balances are different. You can weigh a man by the dreams he carries.", author: "Suketu Mehta", context: "Maximum City" },
    { text: "Mumbai is not just a city, it is an emotion. It never sleeps, never stops, and never gives up.", author: "Popular saying" },
    { text: "This island city was never meant to hold 20 million people, but it does — with grace, chaos, and an unbreakable spirit.", author: "Rohinton Mistry" },
  ],
  delhi: [
    { text: "Delhi is not merely a city. It is a palimpsest of several cities, one built upon the ruins of another.", author: "William Dalrymple", context: "City of Djinns" },
    { text: "Dilli dilwalon ki — Delhi belongs to the big-hearted.", author: "Popular saying" },
    { text: "Seven cities of Delhi, each layer a different empire, a different story, a different heartbeat.", author: "Khushwant Singh" },
    { text: "In Delhi, history is not in museums — you walk on it, eat beside it, and build your home next to it.", author: "Rana Dasgupta" },
    { text: "Delhi is a city that makes you tough. The summers, the winters, the traffic — everything here is extreme.", author: "Popular saying" },
  ],
  bangalore: [
    { text: "Bangalore is like a box of crayons — every shade of India is here, living together, building the future.", author: "Popular saying" },
    { text: "The Garden City taught India to dream in code and brew great coffee while doing it.", author: "Tech community saying" },
    { text: "Bangalore is a place where you come for a job and stay for the weather, the food, and the people.", author: "Popular saying" },
    { text: "India's Silicon Valley is not just about technology — it is about the collision of tradition and innovation.", author: "Nandan Nilekani" },
    { text: "In Bangalore, every auto driver has a startup idea and every chai stall has Wi-Fi.", author: "Tech humour" },
  ],
  chennai: [
    { text: "Chennai is not a city that opens up easily. But once it does, it embraces you like family.", author: "Popular saying" },
    { text: "Madras is music, Madras is filter coffee, Madras is the sea — it is the soul of the South.", author: "Cultural saying" },
    { text: "Chennai lives by the rhythm of Carnatic music, temple bells, and the waves of the Bay of Bengal.", author: "Popular saying" },
    { text: "In Chennai, a meals is never just a meal — it is a ritual, a comfort, and a homecoming.", author: "Food writers" },
    { text: "The thing about Madras is — it doesn't change you. It reveals who you already are.", author: "Popular saying" },
  ],
  hyderabad: [
    { text: "Hyderabad is a city where a 400-year-old monument and a glass tower office exist in the same line of sight.", author: "Popular saying" },
    { text: "Hyderabad ki biryani mein woh baat hai, jo kisi aur biryani mein nahi — there's something in Hyderabad's biryani you won't find elsewhere.", author: "Food saying" },
    { text: "Hyderabad doesn't choose between its Nizami past and its tech future — it lives both, effortlessly.", author: "Travel writers" },
    { text: "This city has the warmth of its people baked into its DNA — from the Irani chai to the way strangers say 'Aadab'.", author: "Popular saying" },
    { text: "Hyderabad is proof that you don't have to sacrifice heritage for progress.", author: "Urban planners" },
  ],
  pune: [
    { text: "Pune is where Maharashtra thinks. Mumbai earns, but Pune reflects.", author: "Popular saying" },
    { text: "The Oxford of the East — where students come for education and stay for the quality of life.", author: "Common reference" },
    { text: "Pune has that rare thing — ambition without the aggression. It is competitive but kind.", author: "Popular saying" },
    { text: "Every Punekar knows: the real Pune is not in Hinjewadi's glass towers but in the gullies of Sadashiv Peth.", author: "Local saying" },
    { text: "Pune's weather is God's apology for Mumbai's rent.", author: "Popular humour" },
  ],
  kolkata: [
    { text: "What Calcutta does today, India does tomorrow.", author: "Gopal Krishna Gokhale" },
    { text: "Kolkata is the only city I know where people still argue about poetry over cups of chai at midnight.", author: "Popular saying" },
    { text: "If you want to know the soul of India, come to Calcutta.", author: "Dominique Lapierre", context: "City of Joy" },
    { text: "Kolkata doesn't rush. It thinks, it debates, it savours. And somehow, it gets there.", author: "Popular saying" },
    { text: "The city of joy, where art, culture, and intellect matter more than money — and that is both its beauty and its curse.", author: "Common observation" },
  ],
  ahmedabad: [
    { text: "Ahmedabad is the Manchester of the East — built on enterprise, sustained by resilience.", author: "Historical reference" },
    { text: "In Ahmedabad, business is not what you do — it is who you are. Every family here has a trader's instinct.", author: "Popular saying" },
    { text: "The Sabarmati holds the memory of a man who shook an empire with just a pinch of salt.", author: "Reference to Gandhi" },
    { text: "Ahmedabad is a vegetarian's paradise — the variety here puts non-veg menus of other cities to shame.", author: "Food writers" },
    { text: "This city runs on khakhra, chai, and sheer determination.", author: "Popular saying" },
  ],
  jaipur: [
    { text: "Jaipur is a city that wears its history like jewellery — proudly, colourfully, and for all to see.", author: "Travel writers" },
    { text: "The Pink City was planned when most of Europe was still building randomly. Jai Singh II was centuries ahead.", author: "Historical reference" },
    { text: "In Jaipur, every stone has a story, every fort has a legend, and every sunset paints the city gold.", author: "Popular saying" },
    { text: "Jaipur teaches you that grandeur and simplicity can share the same street.", author: "Travel writers" },
    { text: "Padharo mhare desh — Welcome to my land. Jaipur's hospitality is legendary for good reason.", author: "Rajasthani saying" },
  ],
  lucknow: [
    { text: "Pehle aap — After you. Lucknow's politeness is not a performance, it is in the city's blood.", author: "Famous Lucknowi saying" },
    { text: "Lucknow is where language becomes poetry, food becomes art, and manners become a way of life.", author: "Popular saying" },
    { text: "The city of nawabs — where even a street vendor will serve you with the grace of a royal host.", author: "Travel writers" },
    { text: "In Lucknow, you don't just eat kebabs — you experience a 300-year-old culinary tradition.", author: "Food writers" },
    { text: "Lucknow ki tehzeeb khatam nahi hoti — the elegance of Lucknow never fades.", author: "Popular saying" },
  ],
  gurgaon: [
    { text: "Gurgaon is India's corporate experiment — a city built by private enterprise in the shadow of the capital.", author: "Urban commentary" },
    { text: "Millennium City rose from farmland to Fortune 500 offices in two decades. That is the Gurgaon story.", author: "Popular saying" },
    { text: "In Gurgaon, the malls are the town squares and the offices are the neighbourhoods.", author: "Urban observation" },
  ],
  noida: [
    { text: "Noida is where Delhi's ambition meets Uttar Pradesh's energy — a city always under construction, always growing.", author: "Popular saying" },
    { text: "From a quiet industrial area to a media and tech hub — Noida's transformation is one of India's urban miracles.", author: "Urban commentary" },
  ],
  chandigarh: [
    { text: "Chandigarh is Le Corbusier's gift to India — a city designed for the human scale.", author: "Architectural reference" },
    { text: "The city beautiful lives up to its name — planned roads, open spaces, and a quality of life most cities envy.", author: "Popular saying" },
    { text: "In Chandigarh, the sector number is your identity, the Rock Garden is your pride, and the Lake is your evening.", author: "Local saying" },
  ],
  amritsar: [
    { text: "Amritsar is faith made tangible — the Golden Temple feeds 100,000 people every day, free, without question.", author: "Popular saying" },
    { text: "The city of the Golden Temple, where langar feeds more people daily than any restaurant chain in the world.", author: "Common tribute" },
  ],
  surat: [
    { text: "Surat polishes 90% of the world's diamonds. The city literally makes the world sparkle.", author: "Industry fact" },
    { text: "Surat has reinvented itself more times than any Indian city — from plague city in 1994 to India's cleanest city.", author: "Popular observation" },
  ],
  vadodara: [
    { text: "Vadodara is the cultural capital of Gujarat — the Laxmi Vilas Palace is larger than Buckingham Palace.", author: "Historical reference" },
    { text: "Baroda has a grace that comes from being a princely state — art, music, and education run deep here.", author: "Cultural saying" },
  ],
  indore: [
    { text: "Indore tops India's cleanliness rankings year after year — the city takes pride in every street corner.", author: "Swachh Bharat" },
    { text: "Sarafa Bazaar at midnight is Indore's real heart — a street food market that wakes up when others sleep.", author: "Food writers" },
  ],
  bhopal: [
    { text: "Bhopal is the city of lakes, the city of poets, and the city that carries its scars with quiet dignity.", author: "Popular saying" },
    { text: "Two lakes, two cultures, Hindu and Muslim heritage side by side — Bhopal is India's composite culture in miniature.", author: "Cultural observation" },
  ],
  coimbatore: [
    { text: "Coimbatore is Tamil Nadu's industrial powerhouse — quiet, efficient, and understated, just like its people.", author: "Popular saying" },
    { text: "The Manchester of South India runs on engineering, textiles, and a no-nonsense work ethic.", author: "Industrial reference" },
  ],
  kochi: [
    { text: "Kochi is where Arabia, China, Portugal, Holland, and England left their fingerprints — a truly cosmopolitan port city.", author: "Historical reference" },
    { text: "In Kochi, the backwaters whisper stories that are older than most nations.", author: "Travel writers" },
  ],
  thiruvananthapuram: [
    { text: "Thiruvananthapuram moves at its own pace — unhurried, educated, and deeply rooted in tradition.", author: "Popular saying" },
    { text: "The land of temples, techies, and ISRO — where rocket science meets coconut groves.", author: "Popular saying" },
  ],
  visakhapatnam: [
    { text: "Vizag has the Bay of Bengal on one side and the Eastern Ghats on the other — nature's own amphitheatre.", author: "Travel writers" },
    { text: "The Jewel of the East Coast is Andhra Pradesh's best-kept secret — but not for much longer.", author: "Popular saying" },
  ],
  mysuru: [
    { text: "Mysuru is the city that proves heritage and cleanliness can go hand in hand — India's second cleanest city.", author: "Swachh Bharat" },
    { text: "Dasara in Mysuru is not a festival — it is a 10-day spectacle that kings started and democracy continued.", author: "Cultural reference" },
  ],
  jodhpur: [
    { text: "The Blue City rises from the Thar Desert like a mirage — except it is real, and it is magnificent.", author: "Travel writers" },
    { text: "Mehrangarh Fort towers over Jodhpur like a guardian — inside its walls, 500 years of Rajput pride.", author: "Historical reference" },
  ],
  udaipur: [
    { text: "Udaipur is the most romantic city in India — the lakes, the palaces, the sunsets, all conspire to make you fall in love.", author: "Travel writers" },
    { text: "The City of Lakes was born from a dream — a Maharana who wanted heaven on earth, and nearly built it.", author: "Historical reference" },
  ],
  varanasi: [
    { text: "Banaras is older than history, older than tradition, older even than legend — and looks twice as old as all of them put together.", author: "Mark Twain" },
    { text: "In Varanasi, death is not feared — it is the ultimate liberation. The ghats have burned for 5,000 years.", author: "Spiritual reference" },
    { text: "Kashi teaches you one thing: life and death are not opposites. They are two ghats on the same river.", author: "Popular saying" },
  ],
  agra: [
    { text: "The Taj Mahal is not a building — it is a love letter written in marble that the whole world reads.", author: "Popular saying" },
    { text: "Behind the Taj, there is a city that has its own stories — of petha, leather, and everyday resilience.", author: "Local saying" },
  ],
  patna: [
    { text: "Patna was Pataliputra — the world's largest city in 300 BC, when London was a swamp.", author: "Historical reference" },
    { text: "Bihar's capital carries 2,500 years of unbroken urban history — few cities on Earth can say the same.", author: "Historical reference" },
  ],
  bhubaneswar: [
    { text: "The Temple City of India — once home to 7,000 temples, each one a masterpiece of Kalinga architecture.", author: "Historical reference" },
    { text: "Bhubaneswar is Odisha's quiet revolution — smart city planning, growing IT, and a deep cultural soul.", author: "Urban commentary" },
  ],
  guwahati: [
    { text: "Guwahati is the gateway to the Northeast — where the Brahmaputra runs wide and the hills begin.", author: "Travel writers" },
    { text: "The city where Assam tea meets tribal heritage, where temples sit beside river islands.", author: "Cultural observation" },
  ],
  goa: [
    { text: "Goa is not a place — it is a state of mind. Susegad: the art of contentment.", author: "Goan philosophy" },
    { text: "Where else in India can you hear church bells and temple bells at the same time, with the ocean as background music?", author: "Popular saying" },
  ],
  nagpur: [
    { text: "Nagpur sits at India's exact geographic centre — the zero mile marker of the nation.", author: "Geographic fact" },
    { text: "The Orange City's Nagpur oranges are famous, but its real sweetness lies in its people.", author: "Popular saying" },
  ],
  madurai: [
    { text: "Madurai is Tamil Nadu's soul city — the Meenakshi Temple has drawn pilgrims for over 2,500 years.", author: "Historical reference" },
    { text: "The city that never sleeps in Tamil Nadu — the Meenakshi temple rituals run from 5 AM to 10 PM daily.", author: "Cultural reference" },
  ],
  vijayawada: [
    { text: "Vijayawada, the city of victory — where the Krishna river blesses the land and ambition drives the people.", author: "Popular saying" },
  ],
  mangalore: [
    { text: "Mangalore is where the Western Ghats meet the Arabian Sea — a city of beaches, temples, and the best seafood in India.", author: "Travel writers" },
  ],
  gwalior: [
    { text: "Gwalior Fort is the 'Pearl amongst fortresses in India' — even the Mughals coveted it.", author: "Babur's memoirs" },
  ],
  raipur: [
    { text: "Raipur is Chhattisgarh's beating heart — a city transforming from a small town into a smart city.", author: "Urban commentary" },
  ],
  kanpur: [
    { text: "Kanpur built the leather and textile industries that dressed a nation — the Manchester of the East.", author: "Industrial reference" },
  ],
  dehradun: [
    { text: "Dehradun sits in the Doon Valley like a secret garden — the mountains on all sides, the pace of life unhurried.", author: "Travel writers" },
  ],
  ranchi: [
    { text: "The city of waterfalls — Ranchi's surrounding forests and cascades make it Jharkhand's green jewel.", author: "Travel writers" },
  ],
  prayagraj: [
    { text: "At Triveni Sangam, three rivers meet — Ganga, Yamuna, and the invisible Saraswati. Prayagraj is where faith has an address.", author: "Spiritual reference" },
  ],
  nashik: [
    { text: "Nashik is India's wine capital — from temple town to vineyard tours, the city keeps reinventing itself.", author: "Popular saying" },
  ],
  aurangabad: [
    { text: "Ajanta and Ellora — two UNESCO sites within driving distance. Aurangabad is a living museum of ancient India.", author: "Heritage reference" },
  ],
  ludhiana: [
    { text: "Ludhiana is Punjab's industrial engine — the city makes the hosiery and bicycles that India runs on.", author: "Industrial reference" },
  ],
  kolhapur: [
    { text: "Kolhapur's Kolhapuri chappals and misal pav are famous — a city of wrestling, spice, and fierce pride.", author: "Cultural reference" },
  ],
  warangal: [
    { text: "The Thousand Pillar Temple and Warangal Fort speak of a Kakatiya dynasty that once ruled all of Deccan.", author: "Historical reference" },
  ],
  trichy: [
    { text: "Rock Fort Ucchi Pillayar Temple stands on a rock that is 3.8 billion years old — one of the oldest on Earth.", author: "Geological fact" },
  ],
  hubli: [
    { text: "Hubli-Dharwad is the cultural twin city of Karnataka — Hindustani music in Dharwad, commerce in Hubli.", author: "Cultural reference" },
  ],
  meerut: [
    { text: "The First War of Independence in 1857 began in Meerut — this city lit the spark of freedom.", author: "Historical reference" },
  ],
  jamshedpur: [
    { text: "Jamshedpur is India's first planned industrial city — built by the Tatas, for the Tatas, and now for all of India.", author: "Industrial reference" },
  ],
  siliguri: [
    { text: "Siliguri is the gateway to Darjeeling, Sikkim, and the entire Northeast — the narrow corridor that connects it all.", author: "Geographic reference" },
  ],
  kota: [
    { text: "Kota sends more students to IIT than any other city in India — the coaching capital of the nation.", author: "Education reference" },
  ],
  "navi-mumbai": [
    { text: "Navi Mumbai was planned as Mumbai's twin — a city built to relieve the pressure of the Maximum City.", author: "Urban planning reference" },
  ],
  thane: [
    { text: "The City of Lakes — Thane has over 30 lakes, more than any other city its size in Maharashtra.", author: "Geographic fact" },
  ],
};

export function getCityQuotes(slug: string): CityQuote[] {
  return CITY_QUOTES[slug] || [];
}

export function getRandomQuote(slug: string, seed: number): CityQuote | null {
  const quotes = getCityQuotes(slug);
  if (quotes.length === 0) return null;
  const index = Math.abs(seed) % quotes.length;
  return quotes[index];
}
