<script lang="ts">
	import "$lib/styles/variables.scss";

	import About from "$lib/components/index/About.svelte";
	import Hero from "$lib/components/index/Hero.svelte";
	import Seo from "$lib/components/meta/SEO.svelte";
</script>

<Seo
	imageURL="favicon.svg"
	ldJSON={{
		"@type": "Person",
		name: "Kennan Hunter",
		email: "mailto:kennanhunter5@gmail.com",
		image: "https://kennan.tech/favicon.svg",
		jobTitle: "Software Developer",

		url: "http://kennan.tech",
	}}
/>

<main>
	<Hero />

	<About />
	<!-- <Skills /> -->

	<!-- <Projects /> -->

	<!-- <Contact /> -->
</main>

<style>
	main {
		max-width: 60em;
		margin: 0 auto;
	}
</style>
