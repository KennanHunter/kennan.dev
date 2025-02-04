<script lang="ts">
	import Center from "../common/Center.svelte";
	import SectionHeader from "../common/SectionHeader.svelte";

	const contactEndpoint =
		"https://portfolio-contact.azurewebsites.net/api/portfolio-discord";
	const contactStorage = "contactStorage";

	let data = {
		name: "",
		contact: "",
		message: "",
	};

	let status: string = "";
	let timedOut: boolean = false;
	let networkError: boolean = false;

	const updateStatus = () => {
		if (networkError) {
			status = "Network Error";
		} else if (timedOut) {
			status = "Please slow down";
		}
	};

	const submit = () => {
		updateStatus();

		if (timedOut) {
			return;
		}

		timedOut = true;

		fetch(contactEndpoint, {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => {
				// Normalize Data
				data = {
					name: "",
					contact: "",
					message: "",
				};

				setTimeout(() => {
					timedOut = false;
				}, 5000);
			})
			.catch(() => {
				timedOut = false;
				networkError = true;
			});
	};
</script>

<section>
	<br />

	<SectionHeader id="contact">Like what you see?</SectionHeader>

	<Center>
		<section>
			<noscript>This Form requires Javascript</noscript>
			<form on:submit|preventDefault>
				<div>
					<h3>Contact Me</h3>
					<div class="info">
						<label for="name">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							bind:value={data.name}
						/>

						<label for="name">Contact</label>
						<input
							type="text"
							name="contact"
							id="contact"
							bind:value={data.contact}
						/>
						<br />
					</div>
					<em style="margin: 0">Email, Discord, SMS etc.</em>

					<br />
					<input
						type="submit"
						value="Send"
						class="shown"
						on:click={submit}
					/>

					<h4 style="color: red;">{status}</h4>
				</div>
				<div>
					<label for="message">Message </label>
					<br />
					<textarea
						name="message"
						id="message"
						bind:value={data.message}
					/>
					<input
						type="submit"
						value="Send"
						class="hidden"
						on:click={submit}
					/>
				</div>
			</form>
		</section>
	</Center>
</section>

<style lang="scss">
	@import "../../styles/variables.scss";
	.hidden {
		display: none;
	}
	h3 {
		margin-top: 0.5em;
	}
	.info {
		display: grid;
		grid-template-columns: auto auto;
		width: 90%;
	}

	@media only screen and (max-width: 800px) {
		.hidden {
			display: initial;
		}
		.shown {
			display: none;
		}
	}

	noscript {
		background-color: $yellow;
	}
	input[type="text"],
	textarea {
		background-color: inherit;
		color: $text;
		padding: 0.5em;
		margin-bottom: 1em;
		resize: none;
		border-radius: 0.5em;
		font-family: "Fira Code", monospace;
	}

	input[type="submit"] {
		text-align: center;
		background-color: $blue;
		border: none;
		color: $text;
		padding: 1em 2em;
		text-decoration: none;
		margin: 4px 2px;
		width: 90%;
		border-radius: 0.5em;
		transition: background-color 0.4s ease-in-out;
		margin-top: 1em;

		&:hover,
		&:focus {
			background-color: $green;
		}
	}

	#message {
		width: 90%;
		height: 15em;
	}

	form {
		display: grid;
		grid-template-columns: 20em auto;
		padding: 1em;
		text-align: left;
		min-width: 40em;
		border: 0.1em solid $text;
		margin: 1em;
		border-radius: 0.5em;
	}

	@media only screen and (max-width: 800px) {
		form {
			all: unset;
			display: flex;
			flex-direction: column;
			border: 0.1em solid $text;
			border-radius: 0.5em;
			padding: 1em;
			gap: 1em;
			margin: 1em;
		}
	}
</style>
