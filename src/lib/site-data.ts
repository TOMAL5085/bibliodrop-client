export type BookStatus = "published" | "unpublished" | "pending_approval";
export type DeliveryStatus = "Pending" | "Dispatched" | "Delivered";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  deliveryFee: number;
  status: BookStatus;
  availability: "Available" | "Checked Out";
  provider: string;
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
    specialty: "Academic collections",
  },
  {
    name: "Mizan Book House",
    avatar: "MB",
    completedDeliveries: 376,
    city: "Chattogram",
    specialty: "Children and fiction",
  },
  {
    name: "North Star Library",
    avatar: "NS",
    completedDeliveries: 341,
    city: "Sylhet",
    specialty: "History and reference",
  },
];

export const books: Book[] = [
  {
    id: "atlas-of-light",
    title: "Atlas of Light",
    author: "Mina Hossain",
    category: "Fiction",
    description:
      "A tender city novel about memory, migration, and the way books keep our lives connected when distance grows long.",
    deliveryFee: 120,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
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
    id: "orbital-lesson",
    title: "Orbital Lesson",
    author: "Farhan Noor",
    category: "Sci-Fi",
    description:
      "A near-future tale about a campus in low orbit, where study groups, algorithms, and courage collide around a failing station.",
    deliveryFee: 160,
    status: "published",
    availability: "Available",
    provider: "North Star Library",
    providerRole: "book owner",
    providerAvatar: "NS",
    addedAt: "2026-06-02",
    coverStart: "#38bdf8",
    coverEnd: "#8b5cf6",
    rating: 4.8,
    reviews: 83,
    deliveries: 44,
    featured: true,
  },
  {
    id: "economics-for-builders",
    title: "Economics for Builders",
    author: "Tanjina Sultana",
    category: "Business",
    description:
      "A practical guide to pricing, markets, and product strategy for small teams that need sharper decisions faster.",
    deliveryFee: 140,
    status: "published",
    availability: "Checked Out",
    provider: "Mizan Book House",
    providerRole: "book owner",
    providerAvatar: "MB",
    addedAt: "2026-06-05",
    coverStart: "#d6d3d1",
    coverEnd: "#0f172a",
    rating: 4.7,
    reviews: 51,
    deliveries: 31,
  },
  {
    id: "foundations-of-cloud",
    title: "Foundations of Cloud",
    author: "Nusrat Jahan",
    category: "Academic",
    description:
      "A concise academic handbook that turns distributed systems, deployment, and security into a readable learning path.",
    deliveryFee: 110,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerRole: "librarian",
    providerAvatar: "AR",
    addedAt: "2026-05-18",
    coverStart: "#10b981",
    coverEnd: "#14b8a6",
    rating: 4.8,
    reviews: 94,
    deliveries: 72,
    featured: true,
  },
  {
    id: "monsoon-archives",
    title: "Monsoon Archives",
    author: "Rafiq Ahmed",
    category: "History",
    description:
      "Essays that map how weather, ports, and trade shaped the region's memory across generations.",
    deliveryFee: 130,
    status: "published",
    availability: "Available",
    provider: "North Star Library",
    providerRole: "book owner",
    providerAvatar: "NS",
    addedAt: "2026-05-11",
    coverStart: "#fb923c",
    coverEnd: "#facc15",
    rating: 4.6,
    reviews: 71,
    deliveries: 26,
  },
  {
    id: "city-of-quiet-pages",
    title: "City of Quiet Pages",
    author: "Rehana Akter",
    category: "Poetry",
    description:
      "A spare collection of poems built from ferry horns, rain, and the soft rituals of reading after sunset.",
    deliveryFee: 90,
    status: "published",
    availability: "Available",
    provider: "Mizan Book House",
    providerRole: "book owner",
    providerAvatar: "MB",
    addedAt: "2026-06-08",
    coverStart: "#f472b6",
    coverEnd: "#c084fc",
    rating: 4.9,
    reviews: 44,
    deliveries: 19,
  },
  {
    id: "circuit-bloom",
    title: "Circuit Bloom",
    author: "Shadman Karim",
    category: "Sci-Fi",
    description:
      "A fast, bright story about bio-robots, neighborhood libraries, and a delivery network that starts thinking for itself.",
    deliveryFee: 150,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerRole: "librarian",
    providerAvatar: "AR",
    addedAt: "2026-06-11",
    coverStart: "#22c55e",
    coverEnd: "#06b6d4",
    rating: 4.7,
    reviews: 65,
    deliveries: 28,
  },
  {
    id: "designing-for-habit",
    title: "Designing for Habit",
    author: "Miftah Chowdhury",
    category: "Business",
    description:
      "How product teams can build durable habits, reduce friction, and earn trust without losing craft.",
    deliveryFee: 145,
    status: "unpublished",
    availability: "Available",
    provider: "North Star Library",
    providerRole: "book owner",
    providerAvatar: "NS",
    addedAt: "2026-05-20",
    coverStart: "#64748b",
    coverEnd: "#1e293b",
    rating: 4.5,
    reviews: 37,
    deliveries: 12,
  },
  {
    id: "lab-notes-2040",
    title: "Lab Notes 2040",
    author: "Arafat Hossain",
    category: "Academic",
    description:
      "A research-oriented primer on applied AI systems, lab workflow, and the ethics of assisted learning.",
    deliveryFee: 170,
    status: "pending_approval",
    availability: "Available",
    provider: "Mizan Book House",
    providerRole: "book owner",
    providerAvatar: "MB",
    addedAt: "2026-06-17",
    coverStart: "#0ea5e9",
    coverEnd: "#22c55e",
    rating: 4.6,
    reviews: 12,
    deliveries: 4,
  },
  {
    id: "paper-harbor",
    title: "Paper Harbor",
    author: "Sadia Khatun",
    category: "Fiction",
    description:
      "A quiet relationship novel about second chances, neighborhood bookstores, and the deliveries that bring people back together.",
    deliveryFee: 115,
    status: "published",
    availability: "Available",
    provider: "North Star Library",
    providerRole: "book owner",
    providerAvatar: "NS",
    addedAt: "2026-06-15",
    coverStart: "#f97316",
    coverEnd: "#ec4899",
    rating: 4.8,
    reviews: 92,
    deliveries: 57,
  },
  {
    id: "the-quiet-index",
    title: "The Quiet Index",
    author: "Nabila Khan",
    category: "History",
    description:
      "An archival journey through marginal notes, catalog cards, and the hidden labor of keeping libraries alive.",
    deliveryFee: 100,
    status: "published",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerRole: "librarian",
    providerAvatar: "AR",
    addedAt: "2026-05-07",
    coverStart: "#cbd5e1",
    coverEnd: "#475569",
    rating: 4.7,
    reviews: 61,
    deliveries: 35,
  },
  {
    id: "tide-of-questions",
    title: "Tide of Questions",
    author: "Jannatul Ferdous",
    category: "Poetry",
    description:
      "A reflective poetry collection arranged like a tide table: repeated, rhythmic, and quietly transformative.",
    deliveryFee: 95,
    status: "published",
    availability: "Checked Out",
    provider: "Mizan Book House",
    providerRole: "book owner",
    providerAvatar: "MB",
    addedAt: "2026-06-03",
    coverStart: "#f9a8d4",
    coverEnd: "#fb7185",
    rating: 4.9,
    reviews: 55,
    deliveries: 29,
  },
  {
    id: "the-lantern-network",
    title: "The Lantern Network",
    author: "Shamim Alvi",
    category: "Fiction",
    description:
      "An ensemble novel about a neighborhood reading program that grows into the city's most trusted delivery network.",
    deliveryFee: 125,
    status: "pending_approval",
    availability: "Available",
    provider: "Ayesha Rahman",
    providerRole: "librarian",
    providerAvatar: "AR",
    addedAt: "2026-06-18",
    coverStart: "#fde68a",
    coverEnd: "#fb7185",
    rating: 4.5,
    reviews: 8,
    deliveries: 3,
  },
];

export const reviewsByBook: Record<string, Review[]> = {
  "atlas-of-light": [
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
  "orbital-lesson": [
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
  "foundations-of-cloud": [
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
    title: "Atlas of Light",
    date: "2026-06-12",
    status: "Delivered",
    fee: 120,
    recipient: "Rahim Ahmed",
    librarian: "Ayesha Rahman",
  },
  {
    id: "d2",
    title: "Foundations of Cloud",
    date: "2026-06-14",
    status: "Dispatched",
    fee: 110,
    recipient: "Nabila Islam",
    librarian: "Ayesha Rahman",
  },
  {
    id: "d3",
    title: "Paper Harbor",
    date: "2026-06-16",
    status: "Pending",
    fee: 115,
    recipient: "Sajid Khan",
    librarian: "North Star Library",
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
    librarianEmail: "ayesha@example.com",
    amount: 110,
    date: "2026-06-14",
  },
  {
    id: "txn_03",
    userEmail: "sajid@example.com",
    librarianEmail: "northstar@example.com",
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
