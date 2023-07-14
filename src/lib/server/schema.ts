import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const Account = sqliteTable('Account', {
    id: text("id").primaryKey().notNull().unique(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    email: text("email").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    oauth_token_secret: text("oauth_token_secret"),
    oauth_token: text("oauth_token"),
});

export const Session = sqliteTable('Session', {
    id: text("id").notNull().unique(),
    sessionToken: text("sessionToken").primaryKey().notNull(),
    userId: text("userId").notNull(),
    expires: integer("expires").notNull(),
});

export const User = sqliteTable('User', {
    id: text("id").primaryKey().notNull().unique(),
    name: text("name"),
    email: text("email"),
    emailVerified: integer("emailVerified", {mode: "boolean"}).notNull().default(false),
    image: text("image"),
});

export const VerificationToken = sqliteTable('VerificationToken', {
    identifier: text("identifier").notNull().unique(),
    token: text("token").primaryKey().notNull(),
    expires: integer("expires").notNull(),
});

export const test = sqliteTable('test', {
    id: text("id").primaryKey().notNull().unique(),
    name: text("name"),
});