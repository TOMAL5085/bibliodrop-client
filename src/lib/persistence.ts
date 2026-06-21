import crypto from "node:crypto";
import { MongoClient, type Collection } from "mongodb";
import {
  books,
  dashboardMetrics,
  getBookById,
  getFilteredBooks,
  getReviewsForBook,
  getSimilarBooks,
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
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop",
      passwordHash: hashPassword("Password@123"),
    },
  {
    id: "u6",
    name: "Rafiq Hasan",
    email: "rafiq@example.com",
    role: "librarian" as AuthRole,
    photoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=256&h=256&fit=crop",
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

      if ((await collections.deliveries.estimatedDocumentCount()) === 0) {
        await collections.deliveries.insertMany(memoryStore.deliveries);
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

export function getBooksFromApi(filters: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}) {
  return getFilteredBooks(filters);
}

export function getBookDetails(id: string) {
  const book = getBookById(id);
  if (!book) {
    return null;
  }

  return {
    book,
    reviews: getReviewsForBook(id),
    similarBooks: getSimilarBooks(book),
  };
}

export function getApprovalQueue() {
  return books.filter((book) => book.status === "pending_approval");
}

export function sanitizeUser(user: AuthUser) {
  return toSanitizedUser(user);
}
