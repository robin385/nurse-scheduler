import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-1tg1fb6_START -->${$$result.title = `<title>About</title>`, ""}<meta name="description" content="About this app"><!-- HEAD_svelte-1tg1fb6_END -->`, ""} <div class="text-column" data-svelte-h="svelte-1t02rsr"><h1>About this app</h1> <p>I wanted to create a simple, static site with SvelteKit. I made it to help with scheduling nurses for a clinic.</p> <pre>npm create svelte@latest</pre> <p>The page you&#39;re looking at is purely static HTML, with no client-side interactivity needed. Because of that, we
    don&#39;t need to load any JavaScript. Try viewing the page&#39;s source, or opening the devtools network panel and
    reloading.</p> <p>The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit&#39;s data loading and form handling. Try using it with JavaScript
    disabled!</p></div>`;
});
export {
  Page as default
};
