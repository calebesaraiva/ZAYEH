import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Box,
  Clock3,
  FileCheck2,
  Headphones,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  RefreshCw,
  Scale,
  Shield,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { buildWhatsAppLink, useStoreSettings } from '../lib/storeSettings';

type PageKey =
  | 'contact'
  | 'help'
  | 'returns'
  | 'shipping'
  | 'privacy'
  | 'terms'
  | 'exchange-policy';

type HeroPoint = {
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
};

type DetailSection = {
  title: string;
  text: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

type PageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  heroPoints: HeroPoint[];
  detailSections: DetailSection[];
  faq: FaqItem[];
  ctaTitle: string;
  ctaText: string;
  ctaHref: string;
  ctaLabel: string;
  ctaMessage?: string;
};

const pageContent: Record<PageKey, PageContent> = {
  contact: {
    eyebrow: 'Contato',
    title: 'Fale Com A ZAYEH',
    subtitle: 'Atendimento humanizado para pedidos, dúvidas, trocas, entrega e suporte geral da sua compra.',
    badge: 'Resposta rápida',
    heroPoints: [
      { icon: MessageCircle, title: 'WhatsApp', text: 'Canal principal para atendimento e confirmação de pedidos.', color: '#22C55E' },
      { icon: Mail, title: 'E-mail', text: 'Ideal para dúvidas detalhadas, suporte e solicitações formais.', color: '#d8a84a' },
      { icon: MapPin, title: 'Imperatriz - MA', text: 'Retirada gratuita na loja mediante confirmação do pedido.', color: '#FFB800' },
      { icon: Clock3, title: 'Horário', text: 'Segunda a sábado, com suporte próximo e retorno rápido.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Como falar com a gente',
        text: [
          'Se você precisa de ajuda com um pedido, produto, retirada, entrega ou pagamento, o atendimento da ZAYEH pode ser feito pelo WhatsApp, e-mail ou redes sociais oficiais.',
          'Para agilizar o suporte, envie nome completo, número do pedido se já existir e uma descrição objetiva do que precisa.',
        ],
      },
      {
        title: 'Atendimento para pedidos',
        text: [
          'Após a compra, nossa equipe pode entrar em contato para confirmar dados, frete e detalhes da entrega quando necessário.',
          'Pedidos com retirada na loja também recebem confirmação para garantir uma experiência organizada e sem ruído.',
        ],
      },
      {
        title: 'Informações da loja',
        text: [
          'Base de atendimento em Imperatriz - MA.',
          'Retirada sem custo disponível para pedidos confirmados, com orientação de horário e endereço no momento do atendimento.',
        ],
      },
    ],
    faq: [
      { question: 'Qual o canal mais rápido?', answer: 'O WhatsApp costuma ser o canal mais rápido para retorno e confirmação de pedidos.' },
      { question: 'Posso pedir atualização do meu pedido?', answer: 'Sim. Basta informar seu nome ou número do pedido para verificarmos o status.' },
      { question: 'Vocês atendem fora de Imperatriz?', answer: 'Sim. A loja atende clientes de todo o Brasil com envio e suporte remoto.' },
    ],
    ctaTitle: 'Precisa de atendimento agora?',
    ctaText: 'Nossa equipe está pronta para orientar sua compra, confirmar entrega e resolver qualquer detalhe do pedido.',
    ctaHref: '/',
    ctaLabel: 'Voltar para a loja',
    ctaMessage: 'Olá! Quero falar com a equipe da ZAYEH.',
  },
  help: {
    eyebrow: 'Ajuda',
    title: 'Central De Ajuda',
    subtitle: 'Tudo o que você precisa para comprar com segurança, entender o processo e resolver dúvidas sem complicação.',
    badge: 'Suporte completo',
    heroPoints: [
      { icon: Headphones, title: 'Atendimento claro', text: 'Orientação simples antes, durante e depois da compra.', color: '#d8a84a' },
      { icon: Shield, title: 'Compra protegida', text: 'Processo seguro com conferência manual quando necessário.', color: '#22C55E' },
      { icon: Truck, title: 'Entrega assistida', text: 'Frete confirmado conforme região e condições da compra.', color: '#FFB800' },
      { icon: RefreshCw, title: 'Pós-venda', text: 'Suporte para trocas, devoluções e acompanhamento do pedido.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Antes de comprar',
        text: [
          'Confira tamanho, volume, descrição, disponibilidade e forma de pagamento mais adequada para o seu pedido.',
          'Em perfumaria, o foco é no volume em ml. Em roupas, observe tamanho, modelagem e coleção.',
        ],
      },
      {
        title: 'Depois da compra',
        text: [
          'Você pode receber confirmação manual sobre frete, retirada, pagamento ou qualquer detalhe importante do pedido.',
          'Se tiver cupom ou condição promocional, ela será refletida conforme as regras ativas no sistema.',
        ],
      },
      {
        title: 'Suporte pós-venda',
        text: [
          'Caso precise trocar, devolver, confirmar andamento ou esclarecer alguma inconsistência, nossa equipe pode ajudar pelo atendimento oficial.',
          'Sempre que possível, tenha em mãos o número do pedido e os dados usados na compra.',
        ],
      },
    ],
    faq: [
      { question: 'O frete aparece automaticamente?', answer: 'Nem sempre. Em muitos casos ele é confirmado manualmente no WhatsApp após o pedido.' },
      { question: 'Existe frete grátis?', answer: 'Sim, quando a promoção estiver ativa ou em pedidos elegíveis acima de R$ 599,99.' },
      { question: 'Posso retirar na loja?', answer: 'Sim. Quando a retirada estiver disponível, ela pode ser selecionada no checkout sem custo de frete.' },
    ],
    ctaTitle: 'Ainda ficou com dúvida?',
    ctaText: 'Se a sua pergunta não estiver respondida aqui, o atendimento da ZAYEH pode orientar você rapidamente.',
    ctaHref: '/contato',
    ctaLabel: 'Falar com a equipe',
    ctaMessage: 'Olá! Preciso de ajuda com uma dúvida na loja ZAYEH.',
  },
  returns: {
    eyebrow: 'Ajuda',
    title: 'Trocas E Devoluções',
    subtitle: 'Processo claro para solicitar ajuste, troca ou devolução com atendimento próximo e sem burocracia desnecessária.',
    badge: 'Até 7 dias',
    heroPoints: [
      { icon: RefreshCw, title: 'Troca simples', text: 'Solicitação com suporte direto pelo atendimento da loja.', color: '#d8a84a' },
      { icon: FileCheck2, title: 'Regras claras', text: 'Produto sem uso e em bom estado, com etiqueta quando aplicável.', color: '#22C55E' },
      { icon: Clock3, title: 'Prazo', text: 'Solicitação em até 7 dias após o recebimento do pedido.', color: '#FFB800' },
      { icon: Shield, title: 'Acompanhamento', text: 'Nossa equipe orienta cada etapa conforme o caso.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Quando a troca é aceita',
        text: [
          'A troca pode ser solicitada em casos como tamanho inadequado, divergência no pedido ou necessidade de ajuste comercial avaliado pela equipe.',
          'O produto deve estar sem sinais de uso indevido, preservado e com etiqueta quando aplicável.',
        ],
      },
      {
        title: 'Quando a devolução é aceita',
        text: [
          'A devolução segue o prazo legal informado pela loja e depende da análise do item devolvido.',
          'Após o recebimento e conferência, a equipe orienta sobre substituição, crédito ou estorno conforme o cenário aprovado.',
        ],
      },
      {
        title: 'Como solicitar',
        text: [
          'Entre em contato com nome, número do pedido e motivo da solicitação.',
          'A equipe indicará os próximos passos, endereço de retorno se necessário e forma de continuidade do atendimento.',
        ],
      },
    ],
    faq: [
      { question: 'Qual é o prazo para pedir troca?', answer: 'O prazo informado pela loja é de até 7 dias após o recebimento do pedido.' },
      { question: 'Posso trocar produto usado?', answer: 'Não. O item precisa voltar em bom estado e dentro das condições de análise da loja.' },
      { question: 'Perfume também pode trocar?', answer: 'Produtos de perfumaria dependem de análise específica e integridade da embalagem/item.' },
    ],
    ctaTitle: 'Quer abrir uma solicitação?',
    ctaText: 'Nosso suporte pode orientar o seu caso e indicar a melhor solução com rapidez.',
    ctaHref: '/contato',
    ctaLabel: 'Solicitar atendimento',
    ctaMessage: 'Olá! Quero solicitar troca ou devolução de um pedido.',
  },
  shipping: {
    eyebrow: 'Ajuda',
    title: 'Formas De Envio',
    subtitle: 'Entenda como funciona a entrega, retirada na loja, frete promocional e confirmação manual para cada pedido.',
    badge: 'Entrega nacional',
    heroPoints: [
      { icon: Truck, title: 'Envio para todo o Brasil', text: 'Pedidos atendidos com suporte e confirmação de entrega.', color: '#22C55E' },
      { icon: BadgeCheck, title: 'Frete grátis promocional', text: 'Disponível quando a condição estiver ativa ou por cupom.', color: '#FFB800' },
      { icon: MessageCircle, title: 'Valor manual no WhatsApp', text: 'Quando necessário, o frete é informado pela equipe após o pedido.', color: '#d8a84a' },
      { icon: MapPin, title: 'Retirada em loja', text: 'Opção gratuita para clientes de Imperatriz - MA.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Entrega com frete informado',
        text: [
          'Em determinadas regiões ou pedidos, o valor do frete pode ser confirmado manualmente no WhatsApp após a compra.',
          'Isso permite validar melhor a entrega e evitar cobranças erradas para o cliente.',
        ],
      },
      {
        title: 'Frete grátis',
        text: [
          'A loja trabalha com frete grátis acima de R$ 599,99 em pedidos elegíveis, além de promoções administradas no painel e cupons com benefício de frete.',
          'Quando a promoção estiver ativa, o sistema já pode refletir essa condição no checkout.',
        ],
      },
      {
        title: 'Retirada na loja',
        text: [
          'Clientes de Imperatriz - MA podem optar pela retirada sem custo, com confirmação de horário e disponibilidade pela equipe.',
          'É uma alternativa rápida para quem quer evitar custo de frete.',
        ],
      },
    ],
    faq: [
      { question: 'O frete sempre é automático?', answer: 'Não. Em alguns casos ele é validado manualmente no WhatsApp.' },
      { question: 'Quando entra frete grátis?', answer: 'Quando houver promoção ativa, pedido elegível acima de R$ 599,99 ou cupom com frete grátis.' },
      { question: 'Posso retirar no mesmo dia?', answer: 'Depende da confirmação do pedido e da disponibilidade da loja no momento.' },
    ],
    ctaTitle: 'Quer comprar agora?',
    ctaText: 'Você pode explorar os produtos e finalizar com a opção de entrega ou retirada que fizer mais sentido.',
    ctaHref: '/categorias',
    ctaLabel: 'Explorar categorias',
  },
  privacy: {
    eyebrow: 'Políticas',
    title: 'Política De Privacidade',
    subtitle: 'Resumo claro sobre coleta, uso e proteção de dados para navegação, atendimento, pedidos e relacionamento com o cliente.',
    badge: 'Dados protegidos',
    heroPoints: [
      { icon: Lock, title: 'Proteção de dados', text: 'Informações usadas para operação, atendimento e segurança da compra.', color: '#22C55E' },
      { icon: Shield, title: 'Uso responsável', text: 'Dados tratados com foco em atendimento e experiência do cliente.', color: '#d8a84a' },
      { icon: Mail, title: 'Comunicação', text: 'Contato apenas quando necessário para pedido, suporte ou campanhas autorizadas.', color: '#FFB800' },
      { icon: FileCheck2, title: 'Transparência', text: 'Política apresentada de forma simples para facilitar a compreensão.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Quais dados podem ser coletados',
        text: [
          'Nome, e-mail, telefone, endereço, dados do pedido e informações necessárias para pagamento, entrega, retirada e suporte.',
          'Também podem ser usados dados técnicos de navegação para melhorar experiência, segurança e funcionamento da loja.',
        ],
      },
      {
        title: 'Como os dados são usados',
        text: [
          'Os dados são utilizados para processar pedidos, confirmar atendimento, validar entrega, aplicar promoções, prestar suporte e melhorar a operação da loja.',
          'Informações não devem ser usadas fora da finalidade comercial e operacional legítima do negócio.',
        ],
      },
      {
        title: 'Segurança e compartilhamento',
        text: [
          'A loja busca adotar medidas razoáveis para proteger os dados tratados dentro do sistema.',
          'Informações podem ser compartilhadas apenas quando necessário para pagamento, entrega, hospedagem, operação técnica ou obrigação legal.',
        ],
      },
    ],
    faq: [
      { question: 'Meus dados são usados só para o pedido?', answer: 'Principalmente para operação do pedido, atendimento e experiência comercial da loja.' },
      { question: 'Vocês compartilham dados com terceiros?', answer: 'Somente quando necessário para operação, pagamento, entrega ou obrigação legal.' },
      { question: 'Posso pedir atualização dos meus dados?', answer: 'Sim. O atendimento da loja pode orientar ajustes e solicitações relacionadas ao cadastro.' },
    ],
    ctaTitle: 'Quer continuar comprando com segurança?',
    ctaText: 'A ZAYEH trabalha para manter uma experiência confiável, transparente e alinhada ao atendimento humanizado da marca.',
    ctaHref: '/',
    ctaLabel: 'Ir para a vitrine',
  },
  terms: {
    eyebrow: 'Políticas',
    title: 'Termos De Uso',
    subtitle: 'Condições gerais para navegação, compra, uso do site, promoções, atendimento e relacionamento com a loja.',
    badge: 'Uso da plataforma',
    heroPoints: [
      { icon: Scale, title: 'Regras da operação', text: 'Organizam o uso do site e das funcionalidades da loja.', color: '#d8a84a' },
      { icon: ShoppingBag, title: 'Pedidos e compras', text: 'Compras dependem de confirmação de dados e disponibilidade.', color: '#22C55E' },
      { icon: Shield, title: 'Segurança', text: 'Uso responsável da plataforma e respeito às políticas da marca.', color: '#FFB800' },
      { icon: FileCheck2, title: 'Clareza comercial', text: 'Promoções, frete e condições seguem regras vigentes no momento da compra.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Uso do site',
        text: [
          'Ao navegar e comprar na loja, o usuário concorda com as condições de uso da plataforma e com as regras comerciais aplicáveis.',
          'A ZAYEH pode atualizar conteúdo, preços, disponibilidade, layout e condições operacionais sempre que necessário.',
        ],
      },
      {
        title: 'Pedidos e confirmação',
        text: [
          'Todo pedido está sujeito à confirmação de estoque, pagamento, dados do cliente e condições logísticas.',
          'Frete, retirada e promoções seguem a configuração ativa do sistema e podem exigir validação manual em alguns casos.',
        ],
      },
      {
        title: 'Responsabilidades',
        text: [
          'O cliente deve preencher corretamente seus dados e acompanhar orientações da equipe quando houver contato para confirmação.',
          'A loja busca manter informações corretas, mas pode ajustar erros evidentes de cadastro, preço ou disponibilidade quando necessário.',
        ],
      },
    ],
    faq: [
      { question: 'O pedido pode ser revisado pela loja?', answer: 'Sim. Em alguns casos a loja pode validar dados, estoque, frete ou pagamento antes da conclusão final.' },
      { question: 'Promoções podem mudar?', answer: 'Sim. Elas dependem da condição ativa no momento da compra e podem ser alteradas posteriormente.' },
      { question: 'Posso usar o site livremente?', answer: 'Sim, desde que o uso seja legítimo, respeitando as regras da plataforma e da operação comercial.' },
    ],
    ctaTitle: 'Pronto para continuar?',
    ctaText: 'Explore a loja sabendo como funciona a operação, os pedidos e as condições gerais de uso da plataforma.',
    ctaHref: '/categorias',
    ctaLabel: 'Ver produtos',
  },
  'exchange-policy': {
    eyebrow: 'Políticas',
    title: 'Política De Trocas',
    subtitle: 'Diretrizes práticas da ZAYEH para trocas comerciais, análise de devolução e atendimento pós-venda com mais clareza.',
    badge: 'Regras da loja',
    heroPoints: [
      { icon: RefreshCw, title: 'Troca orientada', text: 'Cada solicitação é avaliada conforme o tipo de produto e situação do pedido.', color: '#d8a84a' },
      { icon: Clock3, title: 'Prazo informado', text: 'A loja trabalha com até 7 dias para solicitações elegíveis.', color: '#22C55E' },
      { icon: Box, title: 'Condição do item', text: 'Produtos precisam retornar preservados para análise.', color: '#FFB800' },
      { icon: MessageCircle, title: 'Suporte direto', text: 'A equipe acompanha o processo pelo canal oficial de atendimento.', color: '#b8842c' },
    ],
    detailSections: [
      {
        title: 'Elegibilidade',
        text: [
          'A política cobre solicitações dentro do prazo informado, com produto em condição compatível para análise e sem uso inadequado.',
          'Casos específicos podem variar conforme categoria, embalagem, integridade e natureza do item adquirido.',
        ],
      },
      {
        title: 'Produtos com particularidades',
        text: [
          'Itens de perfumaria, cuidados pessoais e produtos com lacre ou condição sensível podem exigir critérios adicionais de conferência.',
          'Roupas e acessórios seguem avaliação de estado, conservação e conformidade com o pedido original.',
        ],
      },
      {
        title: 'Solução oferecida',
        text: [
          'Conforme o caso aprovado, a loja pode orientar troca por outro item, ajuste comercial, crédito ou encaminhamento de devolução.',
          'Toda continuidade depende da conferência do produto e da análise final da equipe.',
        ],
      },
    ],
    faq: [
      { question: 'Toda troca é automática?', answer: 'Não. A solicitação passa por análise conforme o tipo de produto e a condição do item.' },
      { question: 'Posso trocar por outro modelo?', answer: 'Em muitos casos sim, dependendo de estoque, aprovação da solicitação e alinhamento com a equipe.' },
      { question: 'A política é igual para perfume e roupa?', answer: 'Não necessariamente. Produtos de perfumaria podem exigir regras de conferência diferentes.' },
    ],
    ctaTitle: 'Quer alinhar sua solicitação?',
    ctaText: 'Entre em contato com a equipe da ZAYEH para abrir a análise e receber a orientação correta para o seu caso.',
    ctaHref: '/contato',
    ctaLabel: 'Abrir atendimento',
    ctaMessage: 'Olá! Quero falar sobre a política de trocas da ZAYEH.',
  },
};

export default function InfoPage({ pageKey }: { pageKey: PageKey }) {
  const page = pageContent[pageKey];
  const settings = useStoreSettings();
  const whatsappHref = buildWhatsAppLink(settings.whatsapp, page.ctaMessage);
  const useWhatsappRedirect = Boolean(whatsappHref && page.ctaHref === '/contato');

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px,8vw,92px) 20px 52px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(216,168,74,0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(184,132,44,0.12), transparent 28%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#d3b8ff', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 18 }}>
              {page.eyebrow}
            </div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', color: '#fff', lineHeight: 0.95, letterSpacing: '0.04em', marginBottom: 18 }}>
              {page.title}
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.14rem)', color: '#989898', lineHeight: 1.8, maxWidth: 680, marginBottom: 26 }}>
              {page.subtitle}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(216,168,74,0.1)', border: '1px solid rgba(216,168,74,0.18)', color: '#d7b5ff', fontSize: 11.5, fontWeight: 800 }}>
                {page.badge}
              </span>
              <span style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.16)', color: '#ffd77c', fontSize: 11.5, fontWeight: 800 }}>
                Suporte oficial da ZAYEH
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '0 20px 34px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {page.heroPoints.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              style={{ padding: '22px 20px', borderRadius: 24, background: 'linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 14, background: `${item.color}16`, border: `1px solid ${item.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{item.title}</p>
              <p style={{ fontSize: 12.5, color: '#787878', lineHeight: 1.65 }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '18px 20px 34px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(300px, 0.75fr)', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {page.detailSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                style={{ padding: '24px 22px', borderRadius: 24, background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', color: '#fff', letterSpacing: '0.04em', marginBottom: 14 }}>
                  {section.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.text.map((paragraph) => (
                    <p key={paragraph} style={{ fontSize: 14, color: '#808080', lineHeight: 1.85 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ padding: '24px 22px', borderRadius: 24, background: 'linear-gradient(135deg,rgba(35,18,44,0.92),rgba(14,14,18,0.98))', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p style={{ fontSize: 10.5, fontWeight: 900, color: '#d8b4fe', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Resumo rápido</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {page.heroPoints.slice(0, 3).map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{item.title}</p>
                      <p style={{ fontSize: 11.5, color: '#9b9ba3', lineHeight: 1.5 }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              style={{ padding: '24px 22px', borderRadius: 24, background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p style={{ fontSize: 10.5, fontWeight: 900, color: '#FFB800', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Perguntas frequentes</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {page.faq.map((item) => (
                  <div key={item.question} style={{ padding: '14px 14px 13px', borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{item.question}</p>
                    <p style={{ fontSize: 12, color: '#7e7e7e', lineHeight: 1.65 }}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section style={{ padding: '12px 20px 70px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ padding: '28px 24px', borderRadius: 28, background: 'linear-gradient(135deg,rgba(216,168,74,0.1),rgba(184,132,44,0.06),rgba(255,184,0,0.05))', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}
          >
            <div style={{ maxWidth: 640 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: '#d4b4ff', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Próximo passo</p>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: '#fff', letterSpacing: '0.04em', marginBottom: 10 }}>
                {page.ctaTitle}
              </h3>
              <p style={{ fontSize: 13.5, color: '#a0a0a8', lineHeight: 1.75 }}>{page.ctaText}</p>
            </div>
            {useWhatsappRedirect ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="no-underline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderRadius: 14, background: 'linear-gradient(135deg,#d8a84a,#b8842c)', color: '#fff', fontWeight: 900, fontSize: 12.5, letterSpacing: '0.08em', whiteSpace: 'nowrap', boxShadow: '0 16px 34px rgba(216,168,74,0.24)' }}
              >
                {page.ctaLabel} <ArrowRight size={15} />
              </a>
            ) : (
              <Link
                to={page.ctaHref}
                className="no-underline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderRadius: 14, background: 'linear-gradient(135deg,#d8a84a,#b8842c)', color: '#fff', fontWeight: 900, fontSize: 12.5, letterSpacing: '0.08em', whiteSpace: 'nowrap', boxShadow: '0 16px 34px rgba(216,168,74,0.24)' }}
              >
                {page.ctaLabel} <ArrowRight size={15} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
