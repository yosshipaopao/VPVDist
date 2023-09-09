// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DrizzleD1Database } from 'drizzle-orm/d1';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db:DrizzleD1Database;
			KV:KVNamespace;
			R2:R2Bucket;
		}
		// interface PageData {}
		interface Platform {
			DB:D1Database;
			KV:KVNamespace;
			R2:R2Bucket;
		}
	}
}

export {};
