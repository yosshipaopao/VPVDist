import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const Auth = sqliteTable('Auth', {
    id: text("id").primaryKey().notNull().unique(),
    password: text("password").notNull(),
    email: text("email").notNull()
});

export const User = sqliteTable('User', {
    id: text("id").primaryKey().notNull().unique(),
    name: text("name"),
    emailVerified: integer("emailVerified", {mode: "boolean"}).notNull().default(false),
    image: text("image"),
});

export const test = sqliteTable('test', {
    id: text("id").primaryKey().notNull().unique(),
    name: text("name"),
});