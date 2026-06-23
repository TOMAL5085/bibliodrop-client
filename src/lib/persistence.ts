import crypto from "node:crypto";
import { MongoClient, type Collection } from "mongodb";
import {
  type Book,
  books as seedBooks,
  dashboardMetrics,
  getBookById,
  getReviewsForBook,
  reviewsByBook,
  transactions as seededTransactions,
} from "@/lib/site-data";
import { hashPassword, type AuthRole, type AuthUser } from "@/lib/server-auth";

type DeliveryRecord = {
  id: string;
  userEmail: string;
  librarianEmail: string;
  bookId: string;
  status: "Pending" | "Dispatched" | "Delivered";
  amount: number;
  date: string;
};

type ReviewRecord = {
  id: string;
  bookId: string;
  userEmail: string;
  rating: number;
  comment: string;
  verified: boolean;
  date?: string;
};

type TransactionRecord = {
  id: string;
  userEmail: string;
  librarianEmail: string;
  amount: number;
  date: string;
};

type UserDocument = AuthUser & {
  emailLower: string;
};

type Collections = {
  users: Collection<UserDocument>;
  books: Collection<Book>;
  deliveries: Collection<DeliveryRecord>;
  reviews: Collection<ReviewRecord>;
  transactions: Collection<TransactionRecord>;
};

const mongoUri = process.env.MONGODB_URI?.trim();

const memoryStore = {
  users: [
    {
      id: "u1",
      name: "Rahim Ahmed",
      email: "rahim@example.com",
      role: "user" as AuthRole,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
      passwordHash: hashPassword("Password@123"),
    },
    {
      id: "u2",
      name: "Ayesha Rahman",
      email: "ayesha@example.com",
      role: "librarian" as AuthRole,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
      passwordHash: hashPassword("Password@123"),
    },
    {
      id: "u3",
      name: "Nayeem Khan",
      email: "nayeem@example.com",
      role: "librarian" as AuthRole,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
      passwordHash: hashPassword("Password@123"),
    },
  {
    id: "u4",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "librarian" as AuthRole,
    photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
    {
    id: "u5",
    name: "Tanvir Islam",
    email: "tanvir@example.com",
    role: "librarian" as AuthRole,
    photoUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u6",
    name: "Rafiq Hasan",
    email: "rafiq@example.com",
    role: "librarian" as AuthRole,
    photoUrl: "/download.png",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u7",
    name: "Farida Akter",
    email: "farida@example.com",
    role: "librarian" as AuthRole,
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
    {
      id: "u8",
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin" as AuthRole,
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop",
      passwordHash: hashPassword("Admin@123"),
    },
  ] as AuthUser[],
  books: [...seedBooks] as Book[],
  deliveries: [
    {
      id: "d1",
      userEmail: "rahim@example.com",
      librarianEmail: "ayesha@example.com",
      bookId: "moonlit-postcards",
      status: "Delivered" as const,
      amount: 120,
      date: "2026-06-12",
    },
    {
      id: "d2",
      userEmail: "rahim@example.com",
      librarianEmail: "nusrat@example.com",
      bookId: "cloud-systems-primer",
      status: "Delivered" as const,
      amount: 110,
      date: "2026-06-14",
    },
    {
      id: "d3",
      userEmail: "rahim@example.com",
      librarianEmail: "rafiq@example.com",
      bookId: "river-of-empires",
      status: "Delivered" as const,
      amount: 115,
      date: "2026-06-16",
    },
  ] as DeliveryRecord[],
  reviews: Object.entries(reviewsByBook).flatMap(([bookId, items]) =>
    items.map((item) => ({
      id: item.id,
      bookId,
      userEmail: `${item.user.toLowerCase()}@example.com`,
      rating: item.rating,
      comment: item.comment,
      verified: item.verified,
      date: item.date,
    }))
  ) as ReviewRecord[],
  transactions: [...seededTransactions] as TransactionRecord[],
};

let clientPromise: Promise<MongoClient> | null = null;
let seedPromise: Promise<void> | null = null;

function isMongoEnabled() {
  return Boolean(mongoUri);
}

async function getClient() {
  if (!mongoUri) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(mongoUri).connect();
  }

  return clientPromise;
}

async function getCollections(): Promise<Collections | null> {
  const client = await getClient();
  if (!client) {
    return null;
  }

  const db = client.db();
  return {
    users: db.collection<UserDocument>("users"),
    books: db.collection<Book>("books"),
    deliveries: db.collection<DeliveryRecord>("deliveries"),
    reviews: db.collection<ReviewRecord>("reviews"),
    transactions: db.collection<TransactionRecord>("transactions"),
  };
}

async function seedCollections() {
  if (!isMongoEnabled()) {
    return;
  }

  if (!seedPromise) {
    seedPromise = (async () => {
      const collections = await getCollections();
      if (!collections) {
        return;
      }

      if ((await collections.users.estimatedDocumentCount()) === 0) {
        await collections.users.insertMany(
          memoryStore.users.map((user) => ({
            ...user,
            emailLower: user.email.toLowerCase(),
          }))
        );
      }

      const seededBooks = await collections.books
        .find({ id: { $in: memoryStore.books.map((book) => book.id) } })
        .project({ id: 1 })
        .toArray();
      const existingBookIds = new Set(seededBooks.map((book) => book.id));
      const missingBooks = memoryStore.books.filter((book) => !existingBookIds.has(book.id));
      if (missingBooks.length > 0) {
        await collections.books.insertMany(missingBooks);
      }

      const seededDeliveries = await collections.deliveries
        .find({ id: { $in: memoryStore.deliveries.map((delivery) => delivery.id) } })
        .project({ id: 1 })
        .toArray();
      const existingDeliveryIds = new Set(seededDeliveries.map((delivery) => delivery.id));
      const missingDeliveries = memoryStore.deliveries.filter(
        (delivery) => !existingDeliveryIds.has(delivery.id)
      );
      if (missingDeliveries.length > 0) {
        await collections.deliveries.insertMany(missingDeliveries);
      }

      if ((await collections.reviews.estimatedDocumentCount()) === 0) {
        await collections.reviews.insertMany(memoryStore.reviews);
      }

      if ((await collections.transactions.estimatedDocumentCount()) === 0) {
        await collections.transactions.insertMany(memoryStore.transactions);
      }
    })();
  }

  await seedPromise;
}

function toSanitizedUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
  };
}

function findLocalUserByEmail(email: string) {
  return memoryStore.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

function findLocalUserById(id: string) {
  return memoryStore.users.find((user) => user.id === id);
}

function findLocalBookById(id: string) {
  return memoryStore.books.find((book) => book.id === id);
}

function matchesBookFilters(
  book: Book,
  filters: {
    query?: string;
    category?: string;
    status?: string;
    fee?: string;
    sort?: string;
  }
) {
  const query = filters.query?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  const status = filters.status?.trim().toLowerCase();

  if (query) {
    const haystack = `${book.title} ${book.author} ${book.category} ${book.description}`.toLowerCase();
    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (category && book.category.toLowerCase() !== category) {
    return false;
  }

  if (status && book.status.toLowerCase() !== status) {
    return false;
  }

  return true;
}

function sortBooks(booksToSort: Book[], sort?: string) {
  const sortedBooks = [...booksToSort];

  if (sort === "fee-asc") {
    sortedBooks.sort((left, right) => left.deliveryFee - right.deliveryFee);
  } else if (sort === "fee-desc") {
    sortedBooks.sort((left, right) => right.deliveryFee - left.deliveryFee);
  } else if (sort === "rating-desc") {
    sortedBooks.sort((left, right) => right.rating - left.rating);
  }

  return sortedBooks;
}

async function getBookStore() {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.books.find().toArray()) ?? [];
  }

  return [...memoryStore.books];
}

export async function findUserByEmail(email: string) {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    const user = await collections?.users.findOne({ emailLower: email.toLowerCase() });
    return user ?? null;
  }

  return findLocalUserByEmail(email) ?? null;
}

export async function findUserById(id: string) {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    const user = await collections?.users.findOne({ id });
    return user ?? null;
  }

  return findLocalUserById(id) ?? null;
}

export async function findBookById(id: string) {
  const books = await getBookStore();
  return books.find((book) => book.id === id) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
  photoUrl: string;
}) {
  await seedCollections();

  const user: AuthUser = {
    id: `u_${crypto.randomUUID()}`,
    name: input.name,
    email: input.email,
    role: input.role,
    photoUrl: input.photoUrl,
    passwordHash: input.passwordHash,
  };

  if (isMongoEnabled()) {
    const collections = await getCollections();
    await collections?.users.insertOne({
      ...user,
      emailLower: input.email.toLowerCase(),
    });
    return user;
  }

  memoryStore.users.push(user);
  return user;
}

export async function listDeliveries() {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.deliveries.find().sort({ date: -1 }).toArray()) ?? [];
  }

  return [...memoryStore.deliveries];
}

export async function listBooks(filters: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}) {
  const books = await getBookStore();
  let result = books.filter((book) => matchesBookFilters(book, filters));

  if (filters.fee === "under-120") {
    result = result.filter((book) => book.deliveryFee < 120);
  } else if (filters.fee === "120-140") {
    result = result.filter((book) => book.deliveryFee >= 120 && book.deliveryFee <= 140);
  } else if (filters.fee === "over-140") {
    result = result.filter((book) => book.deliveryFee > 140);
  }

  return sortBooks(result, filters.sort);
}

export async function countUsers() {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.users.estimatedDocumentCount()) ?? 0;
  }

  return memoryStore.users.length;
}

export async function countBooks(filters?: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}) {
  const books = await getBookStore();
  return books.filter((book) => matchesBookFilters(book, filters ?? {})).length;
}

export async function createDeliveryRequest(input: { bookId: string; userEmail: string }) {
  await seedCollections();
  const book = getBookById(input.bookId);
  if (!book) {
    return null;
  }

  const record: DeliveryRecord = {
    id: `d_${crypto.randomUUID()}`,
    userEmail: input.userEmail,
    librarianEmail:
      book.providerEmail ?? `${book.provider.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
    bookId: input.bookId,
    status: "Pending",
    amount: book.deliveryFee,
    date: new Date().toISOString().slice(0, 10),
  };

  const transaction: TransactionRecord = {
    id: `txn_${crypto.randomUUID()}`,
    userEmail: input.userEmail,
    librarianEmail: record.librarianEmail,
    amount: book.deliveryFee,
    date: record.date,
  };

  if (isMongoEnabled()) {
    const collections = await getCollections();
    await collections?.deliveries.insertOne(record);
    await collections?.transactions.insertOne(transaction);
  } else {
    memoryStore.deliveries.push(record);
    memoryStore.transactions.push(transaction);
  }

  return record;
}

export async function listReviewsByBookId(bookId: string) {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.reviews.find({ bookId }).sort({ date: -1 }).toArray()) ?? [];
  }

  return memoryStore.reviews.filter((review) => review.bookId === bookId);
}

export async function createReview(input: {
  bookId: string;
  userEmail: string;
  rating: number;
  comment: string;
}) {
  await seedCollections();

  const record: ReviewRecord = {
    id: `r_${crypto.randomUUID()}`,
    bookId: input.bookId,
    userEmail: input.userEmail,
    rating: input.rating,
    comment: input.comment,
    verified: true,
  };

  if (isMongoEnabled()) {
    const collections = await getCollections();
    const delivered = await collections?.deliveries.findOne({
      bookId: input.bookId,
      userEmail: input.userEmail,
      status: "Delivered",
    });

    if (!delivered) {
      return null;
    }

    await collections?.reviews.insertOne(record);
  } else {
    const delivered = memoryStore.deliveries.find(
      (delivery) =>
        delivery.bookId === input.bookId &&
        delivery.userEmail === input.userEmail &&
        delivery.status === "Delivered"
    );

    if (!delivered) {
      return null;
    }

    memoryStore.reviews.push(record);
  }

  return record;
}

export async function listTransactions() {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.transactions.find().sort({ date: -1 }).toArray()) ?? [];
  }

  return [...memoryStore.transactions];
}

export function getDashboardPayload(role: string) {
  const response = {
    user: dashboardMetrics.user,
    librarian: dashboardMetrics.librarian,
    admin: dashboardMetrics.admin,
  };

  return response[role as keyof typeof response] ?? null;
}

export async function getBooksFromApi(filters: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}) {
  return listBooks(filters);
}

export async function getBookDetails(id: string) {
  const book = (await findBookById(id)) ?? getBookById(id);
  if (!book) {
    return null;
  }

  return {
    book,
    reviews: getReviewsForBook(id),
    similarBooks: (await getBookStore())
      .filter(
        (item) =>
          item.id !== book.id &&
          item.status === "published" &&
          item.author === book.author
      )
      .slice(0, 3),
  };
}

export async function getApprovalQueue() {
  return listBooks({ status: "pending_approval" });
}

export function sanitizeUser(user: AuthUser) {
  return toSanitizedUser(user);
}

export async function listAllReviews() {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    return (await collections?.reviews.find().sort({ date: -1 }).toArray()) ?? [];
  }

  return [...memoryStore.reviews];
}

export async function createBook(input: {
  title: string;
  author: string;
  description: string;
  deliveryFee: number;
  category: string;
  coverImage: string;
  provider: string;
  providerEmail: string;
}) {
  await seedCollections();

  const newBook: Book = {
    id: `book_${crypto.randomUUID()}`,
    title: input.title,
    author: input.author,
    description: input.description,
    deliveryFee: input.deliveryFee,
    category: input.category,
    coverImage: input.coverImage || "/covers/default.jpg",
    status: "published",
    availability: "Available",
    provider: input.provider,
    providerEmail: input.providerEmail,
    providerRole: "librarian",
    providerAvatar: input.provider.charAt(0),
    providerPhoto: "",
    coverStart: "#0f172a",
    coverEnd: "#334155",
    addedAt: new Date().toISOString().slice(0, 10),
    rating: 5,
    reviews: 0,
    deliveries: 0,
    featured: false,
  };

  if (isMongoEnabled()) {
    const collections = await getCollections();
    await collections?.books.insertOne(newBook);
  } else {
    memoryStore.books.push(newBook);
  }

  return newBook;
}

export async function updateDeliveryStatus(id: string, status: "Pending" | "Dispatched" | "Delivered") {
  await seedCollections();

  if (isMongoEnabled()) {
    const collections = await getCollections();
    const result = await collections?.deliveries.findOneAndUpdate(
      { id },
      { $set: { status } },
      { returnDocument: "after" }
    );
    return result ?? null;
  }

  const delivery = memoryStore.deliveries.find((d) => d.id === id);
  if (delivery) {
    delivery.status = status;
    return delivery;
  }

  return null;
}
