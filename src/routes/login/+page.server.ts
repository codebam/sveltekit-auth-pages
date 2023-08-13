/** @type {import('./$types').Actions} */
/** @type {import('./$types').Actions} */

export const actions = {
	login: async (event: any) => {
		const result = await event.request.formData();
		const username = result.get('username');
		const password = result.get('password');
		const hash = await event.platform?.env.SVELTE_DB.prepare(
			'SELECT password FROM Users WHERE User = ?'
		)
			.bind(username)
			.all();
		const test_hash = Array.from(
			new Uint8Array(
				await crypto.subtle.digest('SHA-512', new TextEncoder().encode(String(password)))
			)
		)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		if (hash === test_hash) {
			const cookie = event.cookies.set('cookie', test_hash, { path: '/' });
			console.log(event);
		}
	},
	register: async (event: any) => {
		event.request.formData().then(async (result: FormData) => {
			const username = result.get('username');
			const password = result.get('password');
			const hash = Array.from(
				new Uint8Array(
					await crypto.subtle.digest('SHA-512', new TextEncoder().encode(String(password)))
				)
			)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			console.log(event.platform);
			await event.platform?.env.SVELTE_DB.prepare('INSERT INTO Users VALUES (?, ?)')
				.bind(username, hash)
				.all();
		});
	}
};
