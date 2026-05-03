import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userRegions = pgTable('user_regions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  regionName: varchar('region_name', { length: 255 }).notNull(), // e.g., "서울특별시 강남구"
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // LH, SH, etc.
  regionName: varchar('region_name', { length: 255 }).notNull(),
  url: text('url').notNull().unique(),
  publishedDate: timestamp('published_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
