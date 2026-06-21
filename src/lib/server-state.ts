import {
  dashboardMetrics,
  getBookById,
  getFilteredBooks,
  getReviewsForBook,
  getSimilarBooks,
  reviewsByBook,
  transactions as siteTransactions,
} from "@/lib/site-data";
import { hashPassword, type AuthUser } from "@/lib/server-auth";

export type AuthRole = AuthUser["role"];

export type DeliveryRecord = {
  id: string;
  userEmail: string;
  librarianEmail: string;
  bookId: string;
  status: "Pending" | "Dispatched" | "Delivered";
  amount: number;
  date: string;
};

export type ReviewRecord = {
  id: string;
  bookId: string;
  userEmail: string;
  rating: number;
  comment: string;
  verified: boolean;
  date?: string;
};

export type TransactionRecord = {
  id: string;
  userEmail: string;
  librarianEmail: string;
  amount: number;
  date: string;
};

export const users: AuthUser[] = [
  {
    id: "u1",
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    role: "user",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u2",
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u3",
    name: "Nayeem Khan",
    email: "nayeem@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u4",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u5",
    name: "Tanvir Islam",
    email: "tanvir@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u6",
    name: "Rafiq Hasan",
    email: "rafiq@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u7",
    name: "Farida Akter",
    email: "farida@example.com",
    role: "librarian",
    photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Password@123"),
  },
  {
    id: "u8",
    name: "Admin",
    email: "admin@gmail.com",
    role: "admin",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop",
    passwordHash: hashPassword("Admin@123"),
  },
];

export const deliveries: DeliveryRecord[] = [
  {
    id: "d1",
    userEmail: "rahim@example.com",
    librarianEmail: "ayesha@example.com",
    bookId: "moonlit-postcards",
    status: "Delivered",
    amount: 120,
    date: "2026-06-12",
  },
];

export const reviews: ReviewRecord[] = Object.entries(reviewsByBook).flatMap(([bookId, items]) =>
  items.map((item) => ({
    id: item.id,
    bookId,
    userEmail: `${item.user.toLowerCase()}@example.com`,
    rating: item.rating,
    comment: item.comment,
    verified: item.verified,
    date: item.date,
  }))
);

export const transactions: TransactionRecord[] = [...siteTransactions];

export function sanitizeUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
  };
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
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

export function getBookDetailsFromApi(id: string) {
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
  return getBooksFromApi({}).filter((book) => book.status === "pending_approval");
}
