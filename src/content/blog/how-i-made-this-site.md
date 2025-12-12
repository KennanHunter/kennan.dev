---
title: How I made this site
description: Learn the technologies I used to create kennan.tech, my personal portfolio.
pubDate: 2022-05-09

archiveReason: This site has been rebuilt since this post was written! We now use a astro stack. This blog post also happens to be from 2022, and is certainly not representative of me now.
archiveDate: 2024-12-12
---

# Requirements

The first step to any programming project is to understand what the project requires. For my portfolio, I had a few I identified,

1. Fast

1. Flexible

1. Search Engine Friendly

1. Can be hosted for cheap

1. Look nice

# Designing it

My friend [Harper](https://github.com/HarperGLee) and I sketched up the general layout of the website in Figma, a free design program. We focused on making sure that the page was easily readable, and didn't require that much clicking around to use.

![Preview of Website in Figma](/assets/how-i-made-this-site/portfolio-figma-preview.png)

# The Tech Stack

I decided to go with SvelteKit in SSG (Server Side Generation) mode. This meant that despite writing the codebase in a modern JavaScript framework, I had the flexibility to extend it how I wanted to. It also meant that the code could be compiled into static HTML and CSS. Through hydration, Svelte would then take over the static content.

While Svelte lacks the libraries and support that more developed frameworks, such as React, would give me, I decided it was fine due to the low complexity of this website.

# How I write blogs

One library I do use is called [MDsveX](https://mdsvex.pngwn.io/). It allows me to write Markdown code that is interpreted as Svelte. It also is extremely extensible with capabilities such as letting me put Svelte code into the Markdown code, and syntax highlighting.

# Search Engine Optimizations

## Semantic HTML

Something that modern web developers often forget to do is use semantic HTML to suggest to the browser and screen readers the role of content in the page.

Check out [web.dev's tutorial on semantic HTML](https://web.dev/learn/html/semantic-html/) for more information.

## Meta Tags and Open Graph

I use Meta Tags to add descriptions information for both search engines and previews in third party apps.

![Discord Embed Preview](/assets/how-i-made-this-site/discord-embed-preview.png)

## Sitemaps and RSS feeds

I built two custom scripts to generate a SiteMap and RSS feed for my website. Both of these utilize [Vite's glob import function](https://vitejs.dev/guide/features.html#glob-import) to extract our needed data straight from the code itself.

# How it came out

Honestly I'm pretty happy with my personal website right now, but there are a few things I want to change. Currently the Hero section, that is the section above the about section is basically nonexistent.

I'll also get around to writing a blog post about the contact form sometime soon.
