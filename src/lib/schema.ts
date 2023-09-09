import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { sql } from 'drizzle-orm';

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  uid: text("uid").notNull().unique(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

//posts

export const posts = sqliteTable("post", {
  id: text("id").notNull().primaryKey(),
  title: text("title").notNull(),
  version: integer("version").notNull(),
  download: integer("download").notNull().default(0),
  authorId: text("authorId").notNull().references(() => users.uid, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contents = sqliteTable("content", {
  post: text("post").references(() => posts.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  thumbnail: text("thumbnail"),
  file: text("file").notNull(),
  description: text("description").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (content) => ({
  compoundKey: primaryKey(content.post, content.version),
}));