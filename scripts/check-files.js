const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const required = [
  "index.html",
  "styles.css",
  "script.js",
  "vercel.json",
  path.join("assets", "delicie-ganache-drip.png"),
  path.join("assets", "delicie-hero-real-cake.jpg"),
  path.join("assets", "delicie-hero-cake.png"),
  path.join("assets", "proprietaria-delicie-confeiteira.jpg"),
  path.join("assets", "delicie-product-spread.png"),
  path.join("assets", "bolo-piscina-cenoura.jpg"),
  path.join("assets", "bolo-chocolate-amendoim-crocante.jpg"),
  path.join("assets", "bolo-pudim-cremoso-doce-leite.jpg"),
  path.join("assets", "bolo-mole-cremoso.jpg"),
  path.join("assets", "bolo-matilda.jpg"),
  path.join("assets", "slice-sensacao.jpg"),
  path.join("assets", "bolo-cenoura-calda-chocolate.jpg"),
  path.join("assets", "delicie-cta-dessert.png"),
  path.join("assets", "logo-delicie.png"),
  path.join("assets", "favicon-delicie.png"),
  path.join("FOTOS-DELICIE", "bolo-morango-especial.jpg"),
  path.join("FOTOS-DELICIE", "bolo-maracuja-premium.jpg"),
  path.join("FOTOS-DELICIE", "bolo-chocolate-trufado.jpg"),
  path.join("FOTOS-DELICIE", "bolo-brigadeiro-gourmet.jpg"),
  path.join("FOTOS-DELICIE", "hero-bolo-delicie-real.jpg")
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error(`Arquivos ausentes: ${missing.join(", ")}`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const checks = [
  "(85) 98592-0027",
  "@delicieparacuru",
  "Paracuru - CE",
  "Bolo Piscina de Cenoura",
  "Bolo de Chocolate com Amendoim",
  "Calda cremosa e amendoim crocante",
  "Bolo de Pudim Cremoso com Doce de Leite Artesanal",
  "Sobremesas Artesanais",
  "Bolo Mole Cremoso",
  "Bolo Matilda",
  "Bolo de Cenoura com Calda de Chocolate",
  "Slice Sensação",
  "Massa de chocolate, recheio de brigadeiro e mousse de morango.",
  "Cada detalhe feito para adoçar momentos especiais.",
  "transformar ingredientes simples em momentos especiais",
  "Feito com carinho",
  "Produção artesanal",
  "Entrega em Paracuru",
  "Transformando momentos em memórias doces.",
  "Fazer Pedido",
  "Perfeição tem nome e sobrenome: Slice Cake da Deliciê Paracuru.",
  "Ultrapassou minhas expectativas. Todos perguntaram onde eu tinha encomendado.",
  "Amei o capricho e o cuidado com a embalagem."
];

const absentCopy = checks.filter((text) => !html.includes(text));

if (absentCopy.length) {
  console.error(`Conteudos obrigatorios ausentes: ${absentCopy.join(", ")}`);
  process.exit(1);
}

console.log("Landing page Delicie validada.");
