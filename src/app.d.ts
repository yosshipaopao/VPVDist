// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: import('drizzle-orm/d1').DrizzleD1Database;
			KV: KVNamespace;
			R2: R2Bucket;
			lucia: import('$lib/server/lucia').Auth;
			DB: D1Database;
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		interface Platform {
			env: {
				DB: D1Database;
				KV: KVNamespace;
				R2: R2Bucket;
			};
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			image: string;
			email: string;
			emailVerified: number;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
