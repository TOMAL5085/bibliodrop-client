export type BookStatus = "published" | "unpublished" | "pending_approval";
export type DeliveryStatus = "Pending" | "Dispatched" | "Delivered";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverImage: string;
  deliveryFee: number;
  status: BookStatus;
  availability: "Available" | "Checked Out";
  provider: string;
  providerEmail?: string;
  providerRole: "librarian" | "book owner";
  providerAvatar: string;
  coverStart: string;
  coverEnd: string;
  addedAt: string;
  rating: number;
  reviews: number;
  deliveries: number;
  featured?: boolean;
};

export type Review = {
  id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
};

export type DeliveryRow = {
  id: string;
  title: string;
  date: string;
  status: DeliveryStatus;
  fee: number;
  recipient: string;
  librarian: string;
};

export type UserReview = {
  id: string;
  title: string;
  rating: number;
  comment: string;
  date: string;
};

export const siteStats = [
  { label: "Books listed", value: "248", note: "Across local libraries and independent owners" },
  { label: "Delivered this month", value: "1,284", note: "Doorstep requests completed" },
  { label: "Verified reviews", value: "96%", note: "Restricted to delivered orders" },
  { label: "Average delivery time", value: "18 min", note: "Fastest on the selected route" },
];

export const categories = [
  {
    slug: "fiction",
    name: "Fiction",
    accent: "from-amber-200 via-rose-200 to-orange-300",
    description: "Stories that travel from shelf to doorstep.",
  },
  {
    slug: "sci-fi",
    name: "Sci-Fi",
    accent: "from-sky-200 via-cyan-200 to-violet-300",
    description: "Future worlds, smart systems, and bold ideas.",
  },
  {
    slug: "academic",
    name: "Academic",
    accent: "from-emerald-200 via-lime-200 to-teal-300",
    description: "Study materials that arrive when deadlines do.",
  },
  {
    slug: "business",
    name: "Business",
    accent: "from-stone-200 via-zinc-200 to-slate-300",
    description: "Books for founders, operators, and builders.",
  },
  {
    slug: "history",
    name: "History",
    accent: "from-orange-200 via-yellow-200 to-amber-300",
    description: "Timelines, memory, and the shape of the past.",
  },
  {
    slug: "poetry",
    name: "Poetry",
    accent: "from-pink-200 via-fuchsia-200 to-rose-300",
    description: "Compact, expressive, and beautifully human.",
  },
];

export const providers = [
  {
    name: "Ayesha Rahman",
    avatar: "AR",
    completedDeliveries: 482,
    city: "Dhaka",
    specialty: "Fiction",
  },
  {
    name: "Nayeem Khan",
    avatar: "NK",
    completedDeliveries: 368,
    city: "Chattogram",
    specialty: "Sci-Fi",
  },
  {
    name: "Nusrat Jahan",
    avatar: "NJ",
    completedDeliveries: 354,
    city: "Dhaka",
    specialty: "Academic",
  },
  {
    name: "Tanvir Islam",
    avatar: "TI",
    completedDeliveries: 329,
    city: "Sylhet",
    specialty: "Business",
  },
  {
    name: "Rafiq Hasan",
    avatar: "RH",
    completedDeliveries: 315,
    city: "Rajshahi",
    specialty: "History",
  },
  {
    name: "Farida Akter",
    avatar: "FA",
    completedDeliveries: 301,
    city: "Khulna",
    specialty: "Poetry",
  },
];

export const books: Book[] = [
  {
    id: "moonlit-postcards",
    title: "Moonlit Postcards",
    author: "Mina Hossain",
    category: "Fiction",
    description:
      "A tender city novel about memory, migration, and the way letters keep a neighborhood connected after dark.",
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 120,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerEmail: "ayesha@example.com",
    providerRole: "librarian",
    providerAvatar: "AR",
    coverStart: "#f59e0b",
    coverEnd: "#ef4444",
    addedAt: "2026-05-29",
    rating: 4.9,
    reviews: 128,
    deliveries: 68,
    featured: true,
  },
  {
    id: "harbor-of-echoes",
    title: "Harbor of Echoes",
    author: "Farhan Noor",
    category: "Fiction",
    description:
      "An intimate story of families, ferries, and the little stories that move between harbor towns and city apartments.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 128,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerEmail: "ayesha@example.com",
    providerRole: "librarian",
    providerAvatar: "AR",
    coverStart: "#fb7185",
    coverEnd: "#f59e0b",
    addedAt: "2026-06-02",
    rating: 4.8,
    reviews: 83,
    deliveries: 44,
    featured: true,
  },
  {
    id: "signal-after-dawn",
    title: "Signal After Dawn",
    author: "Farhan Noor",
    category: "Sci-Fi",
    description:
      "A near-future mystery where a public library and a dormant satellite start exchanging impossible messages.",
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 160,
    status: "published",
    availability: "Available",
    provider: "Nayeem Khan",
    providerEmail: "nayeem@example.com",
    providerRole: "librarian",
    providerAvatar: "NK",
    addedAt: "2026-06-02",
    coverStart: "#38bdf8",
    coverEnd: "#8b5cf6",
    rating: 4.8,
    reviews: 83,
    deliveries: 44,
    featured: true,
  },
  {
    id: "cloud-systems-primer",
    title: "Cloud Systems Primer",
    author: "Nusrat Jahan",
    category: "Academic",
    description:
      "A readable guide to distributed systems, deployment patterns, and the habits that make modern engineering scalable.",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 110,
    status: "published",
    availability: "Available",
    provider: "Nusrat Jahan",
    providerEmail: "nusrat@example.com",
    providerRole: "librarian",
    providerAvatar: "NJ",
    addedAt: "2026-05-18",
    coverStart: "#10b981",
    coverEnd: "#14b8a6",
    rating: 4.8,
    reviews: 94,
    deliveries: 72,
    featured: true,
  },
  {
    id: "quantitative-methods-lab",
    title: "Quantitative Methods Lab",
    author: "Nusrat Jahan",
    category: "Academic",
    description:
      "A hands-on companion for statistics, research design, and the practical side of classroom analysis.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 118,
    status: "published",
    availability: "Available",
    provider: "Nusrat Jahan",
    providerEmail: "nusrat@example.com",
    providerRole: "librarian",
    providerAvatar: "NJ",
    addedAt: "2026-05-20",
    coverStart: "#64748b",
    coverEnd: "#0f172a",
    rating: 4.6,
    reviews: 47,
    deliveries: 33,
  },
  {
    id: "founders-and-funnels",
    title: "Founders and Funnels",
    author: "Tanjina Sultana",
    category: "Business",
    description:
      "A clean, practical guide to growth, revenue systems, and the product decisions that help small teams scale well.",
    coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 140,
    status: "published",
    availability: "Available",
    provider: "Tanvir Islam",
    providerEmail: "tanvir@example.com",
    providerRole: "librarian",
    providerAvatar: "TI",
    addedAt: "2026-06-05",
    coverStart: "#d6d3d1",
    coverEnd: "#0f172a",
    rating: 4.7,
    reviews: 51,
    deliveries: 31,
  },
  {
    id: "market-moves",
    title: "Market Moves",
    author: "Miftah Chowdhury",
    category: "Business",
    description:
      "A strategy book for founders and operators who want sharper decisions around pricing, positioning, and growth.",
    coverImage: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 145,
    status: "published",
    availability: "Available",
    provider: "Tanvir Islam",
    providerEmail: "tanvir@example.com",
    providerRole: "librarian",
    providerAvatar: "TI",
    addedAt: "2026-05-20",
    coverStart: "#f59e0b",
    coverEnd: "#1e293b",
    rating: 4.5,
    reviews: 37,
    deliveries: 12,
  },
  {
    id: "river-of-empires",
    title: "River of Empires",
    author: "Rafiq Ahmed",
    category: "History",
    description:
      "Essays that trace how trade routes, ports, and river systems shaped the region across centuries of change.",
    coverImage: "https://images.unsplash.com/photo-1455885666463-14c6f2343b3b?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 130,
    status: "published",
    availability: "Available",
    provider: "Rafiq Hasan",
    providerEmail: "rafiq@example.com",
    providerRole: "librarian",
    providerAvatar: "RH",
    addedAt: "2026-05-11",
    coverStart: "#fb923c",
    coverEnd: "#facc15",
    rating: 4.6,
    reviews: 71,
    deliveries: 26,
  },
  {
    id: "chronicles-of-the-delta",
    title: "Chronicles of the Delta",
    author: "Nabila Khan",
    category: "History",
    description:
      "A reflective history of river life, civic memory, and the people who kept local archives alive for generations.",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 102,
    status: "published",
    availability: "Available",
    provider: "Rafiq Hasan",
    providerEmail: "rafiq@example.com",
    providerRole: "librarian",
    providerAvatar: "RH",
    addedAt: "2026-05-07",
    coverStart: "#cbd5e1",
    coverEnd: "#475569",
    rating: 4.7,
    reviews: 61,
    deliveries: 35,
  },
  {
    id: "salt-in-the-margins",
    title: "Salt in the Margins",
    author: "Jannatul Ferdous",
    category: "Poetry",
    description:
      "A reflective poetry collection of sea-salt kitchens, monsoon afternoons, and the life held between margins.",
    coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 95,
    status: "published",
    availability: "Checked Out",
    provider: "Farida Akter",
    providerEmail: "farida@example.com",
    providerRole: "librarian",
    providerAvatar: "FA",
    addedAt: "2026-06-03",
    coverStart: "#f9a8d4",
    coverEnd: "#fb7185",
    rating: 4.9,
    reviews: 55,
    deliveries: 29,
  },
  {
    id: "quiet-weather",
    title: "Quiet Weather",
    author: "Shamim Alvi",
    category: "Poetry",
    description:
      "A compact, luminous set of poems shaped by rain, dusk, and the small rituals that make ordinary days feel sacred.",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83fdd3b6d6c2?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 98,
    status: "published",
    availability: "Available",
    provider: "Farida Akter",
    providerEmail: "farida@example.com",
    providerRole: "librarian",
    providerAvatar: "FA",
    addedAt: "2026-06-18",
    coverStart: "#fde68a",
    coverEnd: "#fb7185",
    rating: 4.5,
    reviews: 8,
    deliveries: 3,
  },
  {
    id: "orbit-classroom",
    title: "Orbit Classroom",
    author: "Shadman Karim",
    category: "Sci-Fi",
    description:
      "A bright future-school adventure about a classroom in orbit where lessons, algorithms, and courage intersect.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    deliveryFee: 154,
    status: "published",
    availability: "Available",
    provider: "Nayeem Khan",
    providerEmail: "nayeem@example.com",
    providerRole: "librarian",
    providerAvatar: "NK",
    addedAt: "2026-06-18",
    coverStart: "#60a5fa",
    coverEnd: "#7c3aed",
    rating: 4.6,
    reviews: 18,
    deliveries: 9,
  },
];

export const reviewsByBook: Record<string, Review[]> = {
  "moonlit-postcards": [
    {
      id: "r1",
      user: "Nusrat",
      date: "2026-06-14",
      rating: 5,
      comment: "Warm, precise, and beautifully paced. The delivery arrived neatly packed and early.",
      verified: true,
    },
    {
      id: "r2",
      user: "Rafiq",
      date: "2026-06-10",
      rating: 4,
      comment: "Feels like a city map drawn from memory and conversation.",
      verified: true,
    },
  ],
  "signal-after-dawn": [
    {
      id: "r3",
      user: "Tania",
      date: "2026-06-12",
      rating: 5,
      comment: "Smart worldbuilding and a surprisingly human center.",
      verified: true,
    },
    {
      id: "r4",
      user: "Imran",
      date: "2026-06-05",
      rating: 4,
      comment: "The setup made me want a sequel immediately.",
      verified: true,
    },
  ],
  "cloud-systems-primer": [
    {
      id: "r5",
      user: "Faria",
      date: "2026-06-11",
      rating: 5,
      comment: "Clear enough for revision, deep enough for class projects.",
      verified: true,
    },
  ],
};

export const deliveryHistory: DeliveryRow[] = [
  {
    id: "d1",
    title: "Moonlit Postcards",
    date: "2026-06-12",
    status: "Delivered",
    fee: 120,
    recipient: "Rahim Ahmed",
    librarian: "Ayesha Rahman",
  },
  {
    id: "d2",
    title: "Cloud Systems Primer",
    date: "2026-06-14",
    status: "Dispatched",
    fee: 110,
    recipient: "Nabila Islam",
    librarian: "Nusrat Jahan",
  },
  {
    id: "d3",
    title: "River of Empires",
    date: "2026-06-16",
    status: "Pending",
    fee: 115,
    recipient: "Sajid Khan",
    librarian: "Rafiq Hasan",
  },
];

export const userReviews: UserReview[] = [
  {
    id: "ur1",
    title: "Atlas of Light",
    rating: 5,
    comment: "Loved the writing and the smooth delivery.",
    date: "2026-06-12",
  },
  {
    id: "ur2",
    title: "Paper Harbor",
    rating: 4,
    comment: "Beautiful cover and very careful packaging.",
    date: "2026-06-18",
  },
];

export const transactions = [
  {
    id: "txn_01",
    userEmail: "rahim@example.com",
    librarianEmail: "ayesha@example.com",
    amount: 120,
    date: "2026-06-12",
  },
  {
    id: "txn_02",
    userEmail: "nabila@example.com",
    librarianEmail: "nusrat@example.com",
    amount: 110,
    date: "2026-06-14",
  },
  {
    id: "txn_03",
    userEmail: "sajid@example.com",
    librarianEmail: "rafiq@example.com",
    amount: 115,
    date: "2026-06-16",
  },
];

export const dashboardMetrics = {
  user: [
    { label: "Total books read", value: "18", delta: "+4 this month" },
    { label: "Pending deliveries", value: "2", delta: "1 awaiting dispatch" },
    { label: "Total spent", value: "1,860", delta: "+340 since last week" },
  ],
  librarian: [
    { label: "Total books listed", value: "42", delta: "6 pending approval" },
    { label: "Total earnings", value: "28,700", delta: "+2,350 this month" },
    { label: "Active requests", value: "9", delta: "4 need update" },
  ],
  admin: [
    { label: "Total users", value: "1,284", delta: "+66 this month" },
    { label: "Total books", value: "248", delta: "19 pending approval" },
    { label: "Total revenue", value: "86,400", delta: "+14% vs last month" },
  ],
};

export const chartData = {
  userTrend: [
    { name: "Mon", value: 2 },
    { name: "Tue", value: 4 },
    { name: "Wed", value: 3 },
    { name: "Thu", value: 5 },
    { name: "Fri", value: 6 },
    { name: "Sat", value: 4 },
  ],
  librarianTrend: [
    { name: "Mon", value: 4 },
    { name: "Tue", value: 7 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 9 },
    { name: "Fri", value: 8 },
    { name: "Sat", value: 10 },
  ],
  adminTrend: [
    { name: "Jan", books: 18, revenue: 4200 },
    { name: "Feb", books: 21, revenue: 5100 },
    { name: "Mar", books: 26, revenue: 6000 },
    { name: "Apr", books: 33, revenue: 7900 },
    { name: "May", books: 38, revenue: 9200 },
    { name: "Jun", books: 44, revenue: 10400 },
  ],
  categoryPie: [
    { name: "Fiction", value: 68 },
    { name: "Academic", value: 52 },
    { name: "Sci-Fi", value: 41 },
    { name: "Business", value: 39 },
    { name: "History", value: 32 },
    { name: "Poetry", value: 16 },
  ],
};

export function getBookById(id: string) {
  return books.find((book) => book.id === id);
}

export function getFeaturedBooks() {
  return books.filter((book) => book.featured && book.status === "published").slice(0, 6);
}

export function getPublishedBooks() {
  return books.filter((book) => book.status === "published");
}

export function getSimilarBooks(book: Book) {
  return books
    .filter(
      (item) =>
        item.id !== book.id &&
        item.status === "published" &&
        (item.category === book.category || item.provider === book.provider)
    )
    .slice(0, 3);
}

export function getReviewsForBook(id: string) {
  return reviewsByBook[id] ?? [];
}

export function getBooksSummary() {
  return {
    totalBooks: books.length,
    publishedBooks: books.filter((book) => book.status === "published").length,
    pendingApproval: books.filter((book) => book.status === "pending_approval").length,
    checkedOut: books.filter((book) => book.availability === "Checked Out").length,
  };
}

export function getFilteredBooks(filters: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}) {
  const query = (filters.query ?? "").trim().toLowerCase();
  const category = (filters.category ?? "").toLowerCase();
  const status = (filters.status ?? "").toLowerCase();
  const fee = (filters.fee ?? "").toLowerCase();

  let results = getPublishedBooks();

  if (query) {
    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
    );
  }

  if (category) {
    results = results.filter((book) => book.category.toLowerCase() === category);
  }

  if (status === "available") {
    results = results.filter((book) => book.availability === "Available");
  }

  if (status === "checked out") {
    results = results.filter((book) => book.availability === "Checked Out");
  }

  if (fee === "under-120") {
    results = results.filter((book) => book.deliveryFee < 120);
  } else if (fee === "120-140") {
    results = results.filter((book) => book.deliveryFee >= 120 && book.deliveryFee <= 140);
  } else if (fee === "over-140") {
    results = results.filter((book) => book.deliveryFee > 140);
  }

  if (filters.sort === "fee-asc") {
    results = [...results].sort((left, right) => left.deliveryFee - right.deliveryFee);
  } else if (filters.sort === "fee-desc") {
    results = [...results].sort((left, right) => right.deliveryFee - left.deliveryFee);
  } else if (filters.sort === "rating-desc") {
    results = [...results].sort((left, right) => right.rating - left.rating);
  } else {
    results = [...results].sort((left, right) => Number(right.featured) - Number(left.featured));
  }

  return results;
}
