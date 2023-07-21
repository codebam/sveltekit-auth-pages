<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>

	<h1>
		Login
	</h1>

	<h2>
		<form method="POST" action="/login?/register">
			<label for="username">username:</label>
			<input type="text" name="username" id="username">
			<label for="password">password:</label>
			<input type="password" name="password" id="password">
			<button>submit</button>
		</form>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
