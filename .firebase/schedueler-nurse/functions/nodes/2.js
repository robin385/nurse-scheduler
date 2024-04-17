import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.CUI7d1a5.js","_app/immutable/chunks/scheduler.C2F96xcg.js","_app/immutable/chunks/index.KwxAMvBS.js","_app/immutable/chunks/each.BrdkGwLC.js","_app/immutable/chunks/index.PYyg6Vbu.js"];
export const stylesheets = [];
export const fonts = [];
