import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const files = sqliteTable('file', {
	url: text('url').notNull().primaryKey(),
	authorId: text('authorId').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	})
});
export const images = sqliteTable('image', {
	url: text('url').notNull().primaryKey(),
	authorId: text('authorId').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	})
});

export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false),
	image: text('image').notNull().default('/images/default-icon.png')
});

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	activeExpires: integer('active_expires').notNull(),
	idleExpires: integer('idle_expires').notNull()
});

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	hashedPassword: text('hashed_password')
});

export const email_verification_token = sqliteTable('email_verification_token', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	expires: integer('expires').notNull()
});

export const password_reset_token = sqliteTable('password_reset_token', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	expires: integer('expires').notNull()
});

//posts

export const posts = sqliteTable('post', {
	id: text('id').notNull().primaryKey(),
	title: text('title').notNull(),
	version: integer('version').notNull(),
	download: integer('download').notNull().default(0),
	authorId: text('authorId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const contents = sqliteTable(
	'content',
	{
		post: text('post').references(() => posts.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		version: integer('version').notNull(),
		thumbnail: text('thumbnail'),
		file: text('file').notNull(),
		description: text('description').notNull(),
		updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(content) => ({
		compoundKey: primaryKey(content.post, content.version)
	})
);
