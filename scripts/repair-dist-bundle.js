import { readFile, writeFile } from "fs/promises";

const bundlePath = new URL("../dist/assets/index-6WcbsBng.js", import.meta.url);

const euroMojibake = (value) => `${value}\uFFFD${String.fromCharCode(0x1A)}\uFFFD`;

const replacements = [
  ["\uFFFD0cosyst\u00E8me digital premium francophone.", "\u00C9cosyst\u00E8me digital premium francophone."],
  ["\uFFFD0cosyst\u00E8me Digital Premium", "\u00C9cosyst\u00E8me Digital Premium"],
  ["\uFFFD0lever l'", "\u00C9lever l'"],
  ["\uFFFD0changez, apprenez et grandissez ensemble.", "\u00C9changez, apprenez et grandissez ensemble."],
  ["\uFFFD0changes Priv\u00E9s", "\u00C9changes Priv\u00E9s"],
  ["\uFFFD0valuer votre productivit\u00E9 actuelle", "\u00C9valuer votre productivit\u00E9 actuelle"],
  [euroMojibake("99"), "99\u20AC"],
  [euroMojibake("149"), "149\u20AC"],
  [euroMojibake("199"), "199\u20AC"],
  [euroMojibake("129"), "129\u20AC"],
  [`children:"\uFFFD ${String.fromCharCode(0x19)}"`, 'children:"\u2192"'],
];

const probes = [
  "\u00C9lever l'",
  "\u00C9changes Priv\u00E9s",
  "\u00C9valuer votre productivit\u00E9 actuelle",
  "99\u20AC",
  "\u00C9cosyst\u00E8me Digital Premium",
];

async function main() {
  let content = await readFile(bundlePath, "utf8");

  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }

  await writeFile(bundlePath, content, "utf8");

  for (const probe of probes) {
    console.log(`${probe}: ${content.includes(probe)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
