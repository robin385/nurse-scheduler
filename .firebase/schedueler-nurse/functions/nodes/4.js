import * as server from '../entries/pages/sverdle/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.js";
export const imports = ["_app/immutable/nodes/4.CAjLsWd9.js","_app/immutable/chunks/scheduler.C2F96xcg.js","_app/immutable/chunks/each.BrdkGwLC.js","_app/immutable/chunks/index.KwxAMvBS.js","_app/immutable/chunks/entry.B1aWtZ3o.js","_app/immutable/chunks/index.PYyg6Vbu.js"];
export const stylesheets = ["_app/immutable/assets/4.DOkkq0IA.css"];
export const fonts = [];
