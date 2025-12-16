// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Kennan Hunter";
export const SITE_DESCRIPTION = "Kennan Hunter's personal website";

export const CMS_URL = import.meta.env.DEV
  ? "https://localhost:8787"
  : "https://cms.kennan.dev";
export const SITE_URL = import.meta.env.DEV
  ? "http://localhost:4321"
  : "https://kennan.dev";
