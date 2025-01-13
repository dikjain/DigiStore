import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  price: integer().notNull(),
  category: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  details: varchar({ length: 255 }),
  message: varchar({ length: 255 }),
  file: varchar({ length: 255 }).notNull(),
  createdBy: varchar('createdBy').notNull().references(() => usersTable.email),
});

export const cartTable = pgTable("cart", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  product: integer().notNull().references(() => productsTable.id),
  email: varchar({ length: 255 }).notNull().references(() => usersTable.email),
});
