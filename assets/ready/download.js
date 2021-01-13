// download page json and related files
// usage:
//   mkdir small.localhost
//   deno run --allow-net --allow-read=. --allow-write=. http://small.fed.wiki/assets/ready/download.js

import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";

let local = 'small.localhost'
let remote = 'http://small.fed.wiki'

ensureDirSync(`${local}/pages`)
ensureDirSync(`${local}/status`)

console.log('working')
let sitemap = await fetch(`${remote}/system/sitemap.json`).then(res=>res.json())
let pages = sitemap.map(info =>
  [`${info.slug}.json`, `pages/${info.slug}`]
)
let status = [
  [`favicon.png`, `status/favicon.png`],
  [`system/sitemap.json`, `status/sitemap.json`]
]
let workers = [...pages, ...status].map(fromto => copy(...fromto))
await Promise.all(workers)
console.log('done')

async function copy(from, to) {
  console.log(`copy ${to}`)
  let body = await fetch(`${remote}/${from}`).then(res => res.text())
  return Deno.writeTextFile(`${local}/${to}`, body);
}