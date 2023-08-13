/** @type {import('./$types').Actions} */
/** @type {import('./$types').Actions} */

export const actions = {
	login: async (event: any) => {
		const session_raw = event.cookies.get('session');

		let session, username, password;
		if (session_raw) {
			session = JSON.parse(session_raw);
			username = session.username;
			password = session.password;
		} else {
			const form = await event.request.formData();
			username = form.get('username');
			const raw_password = form.get('password');
			password = Array.from(
				new Uint8Array(
					await crypto.subtle.digest('SHA-512', new TextEncoder().encode(String(raw_password)))
				)
			)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			event.cookies.set('session', JSON.stringify({ username, password }), {
				path: '/'
			});
		}

		await event.platform?.env.SVELTE_DB.prepare(
			'CREATE TABLE IF NOT EXISTS Users (id TEXT PRIMARY KEY, username TEXT, password TEXT)'
		).all();
		const hashes = await event.platform?.env.SVELTE_DB.prepare(
			'SELECT password FROM Users WHERE username = ?'
		)
			.bind(username)
			.all();
		const hash = hashes.results[0].password;
		if (hash === password) {
			return true;
		}
		return false;
	},
	register: async (event: any) => {
		const result = await event.request.formData();
		const username = result.get('username');
		const raw_password = result.get('password');
		const password = Array.from(
			new Uint8Array(
				await crypto.subtle.digest('SHA-512', new TextEncoder().encode(String(raw_password)))
			)
		)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		const id = crypto.randomUUID();
		await event.platform?.env.SVELTE_DB.prepare(
			'CREATE TABLE IF NOT EXISTS Users (id TEXT PRIMARY KEY, username TEXT, password TEXT)'
		).all();
		await event.platform?.env.SVELTE_DB.prepare('INSERT INTO Users VALUES (?, ?, ?)')
			.bind(id, username, password)
			.all();
		event.cookies.set('session', JSON.stringify({ username, password }), {
			path: '/'
		});
	}
};
