const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const outputName = process.argv[2] || "dist";
const output = path.join(root, outputName);
const files = [
  "index.html",
  "styles.css",
  "script.js",
  path.join("assets", "favicon-delicie.png"),
  path.join("assets", "logo-delicie.png"),
  path.join("assets", "delicie-ganache-drip.png"),
  path.join("assets", "delicie-hero-real-cake.jpg"),
  path.join("assets", "proprietaria-delicie-confeiteira.jpg"),
  path.join("assets", "bolo-piscina-cenoura.jpg"),
  path.join("assets", "bolo-chocolate-amendoim-crocante.jpg"),
  path.join("assets", "bolo-pudim-cremoso-doce-leite.jpg"),
  path.join("assets", "bolo-mole-cremoso.jpg"),
  path.join("assets", "bolo-matilda.jpg"),
  path.join("assets", "bolo-cenoura-calda-chocolate.jpg"),
  path.join("assets", "slice-sensacao.jpg"),
  path.join("FOTOS-DELICIE", "bolo-morango-especial.jpg"),
  path.join("FOTOS-DELICIE", "bolo-maracuja-premium.jpg"),
  path.join("FOTOS-DELICIE", "bolo-chocolate-trufado.jpg"),
  path.join("FOTOS-DELICIE", "bolo-brigadeiro-gourmet.jpg"),
  path.join("FOTOS-DELICIE", "hero-bolo-delicie-real.jpg")
];

if (outputName === "dist") {
  files.push("vercel.json");
}

const check = spawnSync(process.execPath, [path.join(root, "scripts", "check-files.js")], {
  cwd: root,
  stdio: "inherit"
});

if (check.status !== 0) {
  process.exit(check.status || 1);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
}

console.log(`Build estatico pronto em ${path.relative(root, output)}.`);
