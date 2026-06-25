import type { Product } from './products';

const perfumariaImgs = {
  victoria: 'http://www.lattafa-usa.com/cdn/shop/files/Victoria-1_5951ef1c-61de-4bd1-9d5f-1d2b3d1c18cc.png?v=1747417320',
  asad: 'http://www.lattafa-usa.com/cdn/shop/files/Asad-1_ceed76c7-7a80-46b3-b372-68cc309137f4.png?v=1747421311',
  yara: 'http://www.lattafa-usa.com/cdn/shop/files/1_7682153c-2dce-4b60-a9e6-20557f8502cf.png?v=1747500015',
  qaed: 'http://www.lattafa-usa.com/cdn/shop/files/1_9fb3182c-ce4b-4238-ac54-ed0498a19be6.png?v=1747501113',
  asadElixir: 'http://www.lattafa-usa.com/cdn/shop/files/ASADELIXIRBOTTLE.png?v=1760805808',
  alNobleAmeer: 'http://www.lattafa-usa.com/cdn/shop/files/1_89027578-d9b1-4664-a7dc-538f0f110578.png?v=1756361257',
  alNobleSafeer: 'http://www.lattafa-usa.com/cdn/shop/files/1_e42b94e8-2b9a-434c-b247-4e12f50c005c.png?v=1756143307',
  lightBlue: 'http://labelleperfumes.com/cdn/shop/products/dolce-gabbana-light-blue--edt-women.webp?v=1762198205',
  clubWoman: 'http://armaf.com/cdn/shop/files/CDN1.png?v=1774468835&width=2048',
  clubMilestone: 'http://armaf.com/cdn/shop/files/67.png?v=1758576374&width=2048',
  clubMan: 'https://images.tcdn.com.br/img/img_prod/1361374/club_de_nuit_intense_man_edp_105ml_armaf_1_20250823104210_20b58dadce1a.png',
  noir: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
  crystal: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
  signature: 'https://images.unsplash.com/photo-1619994403073-2cec99c8efc4?w=600&q=80',
  velvet: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
  care: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
  spray: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80',
};

type PerfumeItemDef = {
  sku: string;
  slug: string;
  name: string;
  originalPrice: number;
  price: number;
  pixPrice: number;
  installmentValue: number;
  size: string;
  image: string;
  images?: string[];
  tags: string[];
  description: string;
  colors?: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  stock?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
};
const masculineColors = [{ name: 'Preto', hex: '#111111' }, { name: 'Dourado', hex: '#c9a227' }];
const feminineColors = [{ name: 'Rosa', hex: '#d8a84a' }, { name: 'Cristal', hex: '#dbeafe' }];
const premiumColors = [{ name: 'Azul', hex: '#2563eb' }, { name: 'Prata', hex: '#cbd5e1' }];
const genericPerfumeImages = new Set([
  perfumariaImgs.noir,
  perfumariaImgs.crystal,
  perfumariaImgs.signature,
  perfumariaImgs.velvet,
  perfumariaImgs.care,
  perfumariaImgs.spray,
]);

function makePerfumeArt(name: string, size: string, accent = '#d8a84a') {
  const safeName = name.replace(/&/g, '&amp;');
  const safeSize = size.replace(/&/g, '&amp;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fff8e8" />
          <stop offset="100%" stop-color="#ead8b5" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.78" />
          <stop offset="100%" stop-color="#17201d" stop-opacity="0.86" />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#bg)" />
      <circle cx="450" cy="260" r="225" fill="${accent}" opacity="0.16" />
      <circle cx="450" cy="260" r="145" fill="#ffffff" opacity="0.2" />
      <rect x="330" y="164" width="240" height="88" rx="24" fill="#17201d" stroke="rgba(255,255,255,0.28)" />
      <rect x="255" y="254" width="390" height="520" rx="66" fill="url(#glass)" stroke="rgba(122,84,25,0.26)" stroke-width="5" />
      <rect x="292" y="308" width="316" height="414" rx="42" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.18)" />
      <text x="450" y="858" text-anchor="middle" fill="#171d1b" font-family="Georgia, serif" font-size="46" font-weight="700">${safeName}</text>
      <text x="450" y="918" text-anchor="middle" fill="#9b6d22" font-family="Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="6">${safeSize}</text>
      <text x="450" y="1034" text-anchor="middle" fill="#8b806f" font-family="Arial, sans-serif" font-size="23" letter-spacing="8">ZAYEH PERFUMARIA</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const perfumeDefs: PerfumeItemDef[] = [
  { sku: 'PF-101', slug: 'victoria-lattafa', name: 'Victoria Lattafa', originalPrice: 400, price: 339.99, pixPrice: 299.99, installmentValue: 113.33, size: '100ml', image: perfumariaImgs.victoria, images: [perfumariaImgs.victoria, perfumariaImgs.velvet], tags: ['perfumaria', 'lattafa', 'victoria', 'gourmand'], description: 'Perfume marcante da Lattafa com perfil sofisticado, doce e moderno para quem gosta de assinatura intensa.', rating: 4.8, reviews: 38, stock: 11, isNew: true, isBestSeller: true },
  { sku: 'PF-102', slug: 'ameer-al-oudh-intense-oud', name: 'Ameer Al Oudh', originalPrice: 280, price: 237.99, pixPrice: 209.99, installmentValue: 79.33, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'lattafa', 'oud', 'ambarado'], description: 'Fragrancia arabe encorpada, com oud e ambar em destaque para noites frias e presença forte.', colors: masculineColors, rating: 4.7, reviews: 27, stock: 10, isBestSeller: true },
  { sku: 'PF-103', slug: 'dolce-gabbana-light-blue', name: 'Dolce & Gabbana Light Blue', originalPrice: 600, price: 509.99, pixPrice: 449.99, installmentValue: 170.0, size: '100ml', image: perfumariaImgs.lightBlue, images: [perfumariaImgs.lightBlue, perfumariaImgs.crystal], tags: ['perfumaria', 'dolce-gabbana', 'light-blue', 'fresh'], description: 'Classico fresco e luminoso com pegada mediterranea, ideal para quem busca leveza elegante no dia a dia.', colors: premiumColors, rating: 4.9, reviews: 52, stock: 7, isBestSeller: true },
  { sku: 'PF-104', slug: 'liquid-brun', name: 'Liquid Brun', originalPrice: 510, price: 433.49, pixPrice: 382.49, installmentValue: 144.5, size: '100ml', image: perfumariaImgs.velvet, tags: ['perfumaria', 'liquid-brun', 'amadeirado'], description: 'Fragrancia intensa com fundo amadeirado e textura quente, pensada para quem gosta de perfumes maduros.', colors: masculineColors, rating: 4.8, reviews: 19, stock: 8 },
  { sku: 'PF-105', slug: 'spectre', name: 'Spectre', originalPrice: 350, price: 297.49, pixPrice: 262.49, installmentValue: 99.17, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'spectre', 'noturno'], description: 'Essencia de impacto com perfil noturno, boa projeção e presença elegante para ocasiões especiais.', colors: premiumColors, rating: 4.6, reviews: 15, stock: 9 },
  { sku: 'PF-106', slug: 'attar-al-wesal', name: 'Attar Al Wesal', originalPrice: 460, price: 390.99, pixPrice: 344.99, installmentValue: 130.33, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'attar', 'wesal', 'oriental'], description: 'Perfume oriental com assinatura envolvente e fundo quente, ideal para quem curte perfume de presença.', colors: masculineColors, rating: 4.7, reviews: 18, stock: 9 },
  { sku: 'PF-107', slug: 'turathi', name: 'Turathi', originalPrice: 485, price: 412.24, pixPrice: 363.74, installmentValue: 137.41, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'turathi', 'azul', 'fresco'], description: 'Perfume refinado de vibe fresca e elegante, muito procurado por quem gosta de fragrancias limpas e sofisticadas.', colors: premiumColors, rating: 4.8, reviews: 24, stock: 10, isBestSeller: true },
  { sku: 'PF-108', slug: 'salvo-intense', name: 'Salvo Intense', originalPrice: 360, price: 305.99, pixPrice: 269.99, installmentValue: 101.99, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'salvo', 'intense', 'amadeirado'], description: 'Fragrancia intensa com boa fixação e perfil masculino versatil, ótima para uso noturno.', colors: masculineColors, rating: 4.6, reviews: 17, stock: 12 },
  { sku: 'PF-109', slug: 'al-noble-safeer', name: 'Al Noble Safeer', originalPrice: 400, price: 339.99, pixPrice: 299.99, installmentValue: 113.33, size: '100ml', image: perfumariaImgs.alNobleSafeer, tags: ['perfumaria', 'lattafa', 'safeer', 'oriental'], description: 'Lattafa com identidade rica e especiada, equilibrando calor, luxo e performance acima da media.', colors: masculineColors, rating: 4.8, reviews: 21, stock: 11, isNew: true },
  { sku: 'PF-110', slug: 'al-noble-ameer', name: 'Al Noble Ameer', originalPrice: 550, price: 467.49, pixPrice: 412.49, installmentValue: 155.83, size: '100ml', image: perfumariaImgs.alNobleAmeer, tags: ['perfumaria', 'lattafa', 'ameer', 'oud'], description: 'Versao sofisticada da linha Al Noble, com construção intensa, elegante e assinatura de luxo arabe.', colors: masculineColors, rating: 4.9, reviews: 28, stock: 8, isBestSeller: true },
  { sku: 'PF-111', slug: 'al-noble-wazeer', name: 'Al Noble Wazeer', originalPrice: 620, price: 526.99, pixPrice: 464.99, installmentValue: 175.66, size: '100ml', image: perfumariaImgs.velvet, tags: ['perfumaria', 'lattafa', 'wazeer', 'luxo'], description: 'Fragrancia de alto impacto com aura nobre, fundo rico e excelente presença em pele e roupa.', colors: premiumColors, rating: 4.9, reviews: 16, stock: 6, isBestSeller: true },
  { sku: 'PF-112', slug: 'asad-elixir', name: 'Asad Elixir', originalPrice: 550, price: 467.49, pixPrice: 412.49, installmentValue: 155.83, size: '100ml', image: perfumariaImgs.asadElixir, tags: ['perfumaria', 'lattafa', 'asad', 'elixir'], description: 'Interpretação mais opulenta da linha Asad, com rastro marcante e construção quente e intensa.', colors: masculineColors, rating: 4.9, reviews: 31, stock: 8, isNew: true, isBestSeller: true },
  { sku: 'PF-113', slug: 'asad-lattafa', name: 'Asad Lattafa', originalPrice: 440, price: 373.99, pixPrice: 329.99, installmentValue: 124.66, size: '100ml', image: perfumariaImgs.asad, images: [perfumariaImgs.asad, perfumariaImgs.noir], tags: ['perfumaria', 'lattafa', 'asad', 'spicy'], description: 'Um dos arabes mais desejados da atualidade, intenso, especiado e com ótima impressão de sofisticação.', colors: masculineColors, rating: 4.9, reviews: 64, stock: 13, isBestSeller: true },
  { sku: 'PF-114', slug: 'asad-bourbon', name: 'Asad Bourbon', originalPrice: 550, price: 467.49, pixPrice: 412.49, installmentValue: 155.83, size: '100ml', image: perfumariaImgs.spray, tags: ['perfumaria', 'asad', 'bourbon', 'ambarado'], description: 'Perfume intenso com vibe quente e licorosa, perfeito para quem gosta de fragrancias densas e elegantes.', colors: masculineColors, rating: 4.8, reviews: 14, stock: 7, isNew: true },
  { sku: 'PF-115', slug: 'yara-lattafa', name: 'Yara Lattafa', originalPrice: 440, price: 373.99, pixPrice: 329.99, installmentValue: 124.66, size: '100ml', image: perfumariaImgs.yara, tags: ['perfumaria', 'lattafa', 'yara', 'doce'], description: 'Yara da Lattafa entrega dulçor cremoso e vibe feminina moderna, muito querida para uso diário.', colors: feminineColors, rating: 4.8, reviews: 49, stock: 12, isBestSeller: true },
  { sku: 'PF-116', slug: 'ange-ou-demon-givenchy', name: 'Ange ou Demon - Givenchy', originalPrice: 1030, price: 875.49, pixPrice: 772.49, installmentValue: 291.83, size: '100ml', image: perfumariaImgs.crystal, tags: ['perfumaria', 'givenchy', 'ange-ou-demon', 'floral'], description: 'Perfume Givenchy sofisticado, misterioso e elegante, com assinatura luxuosa para momentos especiais.', colors: feminineColors, rating: 4.9, reviews: 22, stock: 5, isBestSeller: true },
  { sku: 'PF-117', slug: 'perseus-exclusif', name: 'Perseus Exclusif', originalPrice: 400, price: 339.99, pixPrice: 299.99, installmentValue: 113.33, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'perseus', 'exclusif'], description: 'Fragrancia premium de construção elegante, com boa fixação e presença refinada para uso versatil.', colors: premiumColors, rating: 4.7, reviews: 13, stock: 9 },
  { sku: 'PF-118', slug: 'qaed-al-fursan', name: 'Qaed Al Fursan', originalPrice: 300, price: 254.99, pixPrice: 224.99, installmentValue: 84.99, size: '100ml', image: perfumariaImgs.qaed, tags: ['perfumaria', 'lattafa', 'qaed-al-fursan', 'frutado'], description: 'Lattafa de saída frutada e fundo intenso, excelente custo-benefício para quem gosta de perfumes marcantes.', colors: masculineColors, rating: 4.8, reviews: 42, stock: 14, isBestSeller: true },
  { sku: 'PF-119', slug: 'silver-scent', name: 'Silver Scent', originalPrice: 360, price: 305.99, pixPrice: 269.99, installmentValue: 101.99, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'silver-scent', 'bogart'], description: 'Assinatura masculina intensa, levemente adocicada e muito conhecida por performance marcante.', colors: masculineColors, rating: 4.6, reviews: 26, stock: 10 },
  { sku: 'PF-120', slug: 'silver-scent-intense', name: 'Silver Scent Intense', originalPrice: 380, price: 322.99, pixPrice: 284.99, installmentValue: 107.66, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'silver-scent', 'intense'], description: 'Versão mais potente do classico Silver Scent, com projeção elevada e estilo noturno.', colors: masculineColors, rating: 4.7, reviews: 18, stock: 9 },
  { sku: 'PF-121', slug: 'fakhar-black', name: 'Fakhar Black', originalPrice: 420, price: 356.99, pixPrice: 314.99, installmentValue: 119.0, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'lattafa', 'fakhar', 'black'], description: 'Fakhar Black une frescor, elegância e ótima versatilidade, sendo uma escolha certeira para uso diário.', colors: masculineColors, rating: 4.8, reviews: 34, stock: 12, isBestSeller: true },
  { sku: 'PF-122', slug: 'fakhar-gold', name: 'Fakhar Gold', originalPrice: 440, price: 373.99, pixPrice: 329.99, installmentValue: 124.66, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'lattafa', 'fakhar', 'gold'], description: 'Versão mais luxuosa da linha Fakhar, com assinatura elegante e sensação premium no uso.', colors: premiumColors, rating: 4.7, reviews: 15, stock: 8 },
  { sku: 'PF-123', slug: 'fakhar-rose', name: 'Fakhar Rose', originalPrice: 450, price: 382.49, pixPrice: 337.49, installmentValue: 127.5, size: '100ml', image: perfumariaImgs.crystal, tags: ['perfumaria', 'lattafa', 'fakhar', 'rose'], description: 'Fragrancia floral moderna da Lattafa, feminina, elegante e com dulçor na medida.', colors: feminineColors, rating: 4.8, reviews: 29, stock: 11, isBestSeller: true },
  { sku: 'PF-124', slug: 'the-kingdom', name: 'The Kingdom', originalPrice: 460, price: 390.99, pixPrice: 344.99, installmentValue: 130.33, size: '100ml', image: perfumariaImgs.velvet, tags: ['perfumaria', 'the-kingdom', 'premium'], description: 'Perfume imponente com perfil elegante e construção rica, ideal para quem gosta de assinatura forte.', colors: premiumColors, rating: 4.7, reviews: 12, stock: 7 },
  { sku: 'PF-125', slug: 'vulcan-feel', name: 'Vulcan Feel', originalPrice: 600, price: 509.99, pixPrice: 449.99, installmentValue: 170.0, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'vulcan', 'feel'], description: 'Fragrancia robusta e moderna, com sensação premium e ótima performance para quem gosta de chamar atenção.', colors: premiumColors, rating: 4.8, reviews: 11, stock: 6 },
  { sku: 'PF-126', slug: 'musk-mood', name: 'Musk Mood', originalPrice: 280, price: 237.99, pixPrice: 209.99, installmentValue: 79.33, size: '100ml', image: perfumariaImgs.crystal, tags: ['perfumaria', 'musk-mood', 'musk'], description: 'Perfume de almiscar limpo e confortável, muito agradável para uso diário e clima quente.', colors: feminineColors, rating: 4.7, reviews: 23, stock: 10 },
  { sku: 'PF-127', slug: 'velvet-oud', name: 'Velvet Oud', originalPrice: 310, price: 263.49, pixPrice: 232.49, installmentValue: 87.83, size: '100ml', image: perfumariaImgs.velvet, tags: ['perfumaria', 'velvet-oud', 'oud'], description: 'Oud elegante com toque aveludado e assinatura rica, ótima pedida para quem curte perfumes orientais.', colors: masculineColors, rating: 4.8, reviews: 25, stock: 11 },
  { sku: 'PF-128', slug: 'club-de-nuit-intense-man', name: 'Club de Nuit Intense Man', originalPrice: 485, price: 412.24, pixPrice: 363.74, installmentValue: 137.41, size: '105ml', image: perfumariaImgs.clubMan, images: [perfumariaImgs.clubMan, perfumariaImgs.noir], tags: ['perfumaria', 'armaf', 'club-de-nuit', 'intense-man'], description: 'Um dos perfumes mais desejados da Armaf, conhecido pela vibe sofisticada, masculina e excelente projeção.', colors: masculineColors, rating: 4.9, reviews: 63, stock: 13, isBestSeller: true },
  { sku: 'PF-129', slug: 'club-de-nuit-woman', name: 'Club de Nuit Woman', originalPrice: 450, price: 382.49, pixPrice: 337.49, installmentValue: 127.5, size: '105ml', image: perfumariaImgs.clubWoman, images: [perfumariaImgs.clubWoman, perfumariaImgs.crystal], tags: ['perfumaria', 'armaf', 'club-de-nuit', 'woman'], description: 'Fragrancia feminina elegante e marcante da Armaf, ótima para quem busca sofisticação com boa fixação.', colors: feminineColors, rating: 4.8, reviews: 37, stock: 10, isBestSeller: true },
  { sku: 'PF-130', slug: 'club-de-nuit-milestone', name: 'Club de Nuit Milestone', originalPrice: 500, price: 424.99, pixPrice: 374.99, installmentValue: 141.66, size: '105ml', image: perfumariaImgs.clubMilestone, images: [perfumariaImgs.clubMilestone, perfumariaImgs.lightBlue], tags: ['perfumaria', 'armaf', 'club-de-nuit', 'milestone'], description: 'Perfume fresco e sofisticado com assinatura marítima elegante, excelente para climas mais quentes.', colors: premiumColors, rating: 4.8, reviews: 32, stock: 8, isBestSeller: true },
  { sku: 'PF-131', slug: 'arsenal', name: 'Arsenal', originalPrice: 315, price: 267.74, pixPrice: 236.24, installmentValue: 89.25, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'arsenal', 'bogart'], description: 'Perfume masculino de pegada intensa e urbana, ideal para quem quer fragrancia forte sem exagero.', colors: masculineColors, rating: 4.5, reviews: 14, stock: 9 },
  { sku: 'PF-132', slug: 'million', name: 'Million', originalPrice: 770, price: 688.5, pixPrice: 577.5, installmentValue: 218.16, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'million', 'paco-rabanne'], description: 'Classico luxuoso de perfil doce e poderoso, ótimo para quem gosta de perfumes reconhecíveis e marcantes.', colors: premiumColors, rating: 4.9, reviews: 54, stock: 6, isBestSeller: true },
  { sku: 'PF-133', slug: 'sabah', name: 'Sabah', originalPrice: 350, price: 297.49, pixPrice: 262.49, installmentValue: 99.17, size: '100ml', image: perfumariaImgs.crystal, tags: ['perfumaria', 'sabah', 'oriental'], description: 'Fragrancia de assinatura elegante com presença envolvente e sensação limpa na saída.', colors: feminineColors, rating: 4.6, reviews: 12, stock: 8 },
  { sku: 'PF-134', slug: 'azure-fantasy', name: 'Azure Fantasy', originalPrice: 970, price: 824.49, pixPrice: 727.49, installmentValue: 274.83, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'azure-fantasy', 'luxo'], description: 'Perfume premium com perfil luminoso e refinado, pensado para quem procura algo mais exclusivo.', colors: premiumColors, rating: 4.9, reviews: 9, stock: 4, isBestSeller: true },
  { sku: 'PF-135', slug: 'udv-for-men-paris', name: 'Udv For Men Paris', originalPrice: 145, price: 123.24, pixPrice: 108.74, installmentValue: 41.08, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'udv', 'for-men'], description: 'Fragrancia acessível e versátil com perfil masculino limpo, excelente opção de entrada.', colors: masculineColors, rating: 4.4, reviews: 21, stock: 16 },
  { sku: 'PF-136', slug: 'udv-star', name: 'Udv Star', originalPrice: 145, price: 123.24, pixPrice: 108.74, installmentValue: 41.08, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'udv', 'star'], description: 'Perfume jovem e versátil com projeção equilibrada para uso diário e preço bem competitivo.', colors: premiumColors, rating: 4.3, reviews: 14, stock: 17 },
  { sku: 'PF-137', slug: 'udv-night', name: 'Udv Night', originalPrice: 134.99, price: 123.24, pixPrice: 101.25, installmentValue: 38.25, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'udv', 'night'], description: 'Versão noturna da UDV com perfil um pouco mais intenso e boa entrega para o preço.', colors: masculineColors, rating: 4.3, reviews: 12, stock: 15 },
  { sku: 'PF-138', slug: 'watani-noir', name: 'Watani Noir', originalPrice: 250, price: 212.49, pixPrice: 187.49, installmentValue: 70.83, size: '100ml', image: perfumariaImgs.velvet, tags: ['perfumaria', 'watani', 'noir'], description: 'Perfume escuro e elegante com ótima proposta para quem gosta de fragrancias de personalidade.', colors: masculineColors, rating: 4.6, reviews: 11, stock: 10 },
  { sku: 'PF-139', slug: 'khanjar', name: 'Khanjar', originalPrice: 840, price: 713.99, pixPrice: 629.99, installmentValue: 237.99, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'khanjar', 'luxo'], description: 'Perfume de perfil luxuoso e construção intensa, ideal para colecionadores e amantes de arabes premium.', colors: premiumColors, rating: 4.9, reviews: 8, stock: 4, isBestSeller: true },
  { sku: 'PF-140', slug: 'cuba-royal', name: 'Cuba Royal', originalPrice: 90, price: 84.15, pixPrice: 74.25, installmentValue: 28.05, size: '100ml', image: perfumariaImgs.noir, tags: ['perfumaria', 'cuba', 'royal'], description: 'Perfume acessível com boa presença e assinatura tradicional, excelente para uso casual.', colors: masculineColors, rating: 4.4, reviews: 19, stock: 18 },
  { sku: 'PF-141', slug: 'cuba-winner', name: 'Cuba Winner', originalPrice: 90, price: 84.15, pixPrice: 74.25, installmentValue: 28.05, size: '100ml', image: perfumariaImgs.signature, tags: ['perfumaria', 'cuba', 'winner'], description: 'Fragrancia jovem e versátil da linha Cuba, com ótimo custo-benefício e boa saída.', colors: premiumColors, rating: 4.3, reviews: 15, stock: 18 },
  { sku: 'PF-142', slug: 'cuba-paris', name: 'Cuba Paris', originalPrice: 90, price: 84.15, pixPrice: 74.25, installmentValue: 28.05, size: '100ml', image: perfumariaImgs.crystal, tags: ['perfumaria', 'cuba', 'paris'], description: 'Perfume leve e versátil da linha Cuba, ótimo para quem busca fragrancia acessível e agradável.', colors: feminineColors, rating: 4.3, reviews: 13, stock: 17 },
  { sku: 'PF-143', slug: 'hidratante-angel-mugler-original-200ml', name: 'Hidratante Angel Mugler Original 200ML', originalPrice: 769.99, price: 769.99, pixPrice: 769.99, installmentValue: 256.66, size: '200ml', image: perfumariaImgs.care, tags: ['perfumaria', 'hidratante', 'mugler', 'angel'], description: 'Hidratante original Angel Mugler com perfumação sofisticada e textura rica para rotina premium de cuidados.', colors: feminineColors, rating: 4.9, reviews: 7, stock: 5, isBestSeller: true },
  { sku: 'PF-144', slug: 'pasta-hidratante-arabes-asad-200ml', name: 'Pasta de Hidratante Árabes Asad 200ML', originalPrice: 264.99, price: 264.99, pixPrice: 264.99, installmentValue: 88.33, size: '200ml', image: perfumariaImgs.care, tags: ['perfumaria', 'hidratante', 'arabes', 'asad'], description: 'Pasta hidratante corporal inspirada em fragrancias árabes, com toque macio e perfumação intensa.', colors: masculineColors, rating: 4.7, reviews: 8, stock: 9 },
  { sku: 'PF-145', slug: 'pasta-hidratante-arabes-club-de-nuit-200ml', name: 'Pasta de Hidratante Árabes Club De Nuit 200ML', originalPrice: 264.99, price: 264.99, pixPrice: 264.99, installmentValue: 88.33, size: '200ml', image: perfumariaImgs.care, tags: ['perfumaria', 'hidratante', 'arabes', 'club-de-nuit'], description: 'Versão hidratante inspirada na linha Club De Nuit, ideal para prolongar a sensação perfumada na pele.', colors: premiumColors, rating: 4.7, reviews: 6, stock: 8 },
  { sku: 'PF-146', slug: 'spray-arabe-royal-amber-300ml', name: 'Perfume em Spray Árabe Royal Amber 300ML', originalPrice: 129.99, price: 129.99, pixPrice: 129.99, installmentValue: 43.33, size: '300ml', image: perfumariaImgs.spray, tags: ['perfumaria', 'spray', 'royal-amber'], description: 'Spray árabe perfumado com volume generoso e assinatura quente, ótimo para corpo e ambiente pessoal.', colors: premiumColors, rating: 4.5, reviews: 7, stock: 14 },
  { sku: 'PF-147', slug: 'spray-arabe-asad-bourbon-300ml', name: 'Perfume em Spray Árabe Asad de Bourbon 300ML', originalPrice: 129.99, price: 129.99, pixPrice: 129.99, installmentValue: 43.33, size: '300ml', image: perfumariaImgs.spray, tags: ['perfumaria', 'spray', 'asad', 'bourbon'], description: 'Spray perfumado inspirado na linha Asad Bourbon, com assinatura intensa e fácil aplicação.', colors: masculineColors, rating: 4.6, reviews: 8, stock: 13 },
  { sku: 'PF-148', slug: 'spray-arabe-club-de-nuit-woman-300ml', name: 'Perfume em Spray Árabe Club de Nuit Woman 300ML', originalPrice: 129.99, price: 129.99, pixPrice: 129.99, installmentValue: 43.33, size: '300ml', image: perfumariaImgs.spray, tags: ['perfumaria', 'spray', 'club-de-nuit', 'woman'], description: 'Spray corporal perfumado da linha Club de Nuit Woman, com perfil feminino elegante e boa presença.', colors: feminineColors, rating: 4.5, reviews: 6, stock: 12 },
  { sku: 'PF-149', slug: 'spray-arabe-fakhar-rose-300ml', name: 'Perfume em Spray Árabe Fakhar Rose 300ML', originalPrice: 129.99, price: 129.99, pixPrice: 129.99, installmentValue: 43.33, size: '300ml', image: perfumariaImgs.spray, tags: ['perfumaria', 'spray', 'fakhar', 'rose'], description: 'Spray de grande volume com perfil floral moderno, pensado para quem gosta de fragrancias femininas marcantes.', colors: feminineColors, rating: 4.5, reviews: 6, stock: 12 },
];

export const perfumariaCatalog: Product[] = perfumeDefs.map((item, index) => {
  const resolvedImage = genericPerfumeImages.has(item.image)
    ? makePerfumeArt(item.name, item.size, '#d8a84a')
    : item.image;

  return {
    id: `perf-${index + 101}`,
    name: item.name,
    slug: item.slug,
    price: item.price,
    originalPrice: item.originalPrice,
    pixPrice: item.pixPrice,
    installments: { count: 3, value: item.installmentValue },
    image: resolvedImage,
    images: [resolvedImage],
    category: 'Perfumaria',
    categorySlug: 'perfumaria',
    collection: 'Perfumaria Premium',
    tags: item.tags,
    description: item.description,
    sizes: [item.size],
    colors: [],
    stock: item.stock ?? 10,
    rating: item.rating,
    reviews: item.reviews,
    isNew: item.isNew ?? false,
    isBestSeller: item.isBestSeller ?? false,
    discount: Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100),
    sku: item.sku,
  };
});
