/** @type {import('./$types').Actions} */
/** @type {import('./$types').Actions} */

export const actions = {
	login: async (event: any) => {
		// TODO log the user in
		console.log(event);
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
			await event.platform?.env.SVELTE_DB.prepare('INSERT INTO Users VALUES (?, ?)')
				.bind(username, hash)
				.all();
		});
	}
};
