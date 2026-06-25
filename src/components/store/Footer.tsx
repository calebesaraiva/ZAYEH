import { AtSign, Heart, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8d6b2f, #d8a84a, #f0cf82)', padding: '2px' }}
              >
                <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                  <span className="text-[11px] font-black text-white tracking-tight">ZY</span>
                </div>
              </div>
              <div>
                <div className="font-display font-black text-xl tracking-widest uppercase text-[#f0cf82]">ZAYEH</div>
                <div className="text-[9px] text-[#8f7a4b] tracking-[0.3em] uppercase">Studio Edit</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Moda, acessórios e perfumaria com visual mais sofisticado, contraste quente e assinatura própria.
            </p>
            <div className="flex items-center gap-2 text-xs text-yellow-500/70 border border-yellow-500/10 rounded-full px-3 py-1.5 w-fit">
              <Trophy size={11} />
              <span>Coleção Copa 2026 Disponível</span>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 glass rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors">
                <AtSign size={15} />
              </a>
            </div>
          </div>

          {[
            { title: 'Loja', links: ['Novidades', 'Coleção Copa 2026', 'Vestidos', 'Blazers & Conjuntos', 'Sale'] },
            { title: 'Atendimento', links: ['Central de Ajuda', 'Rastrear Pedido', 'Trocas e Devoluções', 'Guia de Tamanhos', 'Fale Conosco'] },
            { title: 'ZAYEH', links: ['Sobre Nós', 'Manifesto', 'Curadoria', 'Editorial', 'Contato'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`text-sm transition-colors ${
                      link === 'Coleção Copa 2026' ? 'text-yellow-500/80 hover:text-yellow-400 font-medium' : 'text-gray-500 hover:text-orange-400'
                    }`}>
                      {link === 'Coleção Copa 2026' && '⚽ '}{link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4"
          style={{ border: '1px solid rgba(249,115,22,0.1)' }}
        >
          <div className="flex-1">
            <h4 className="font-bold mb-1">Receba novidades em primeira mão ⚡</h4>
            <p className="text-sm text-gray-500">Cadastre-se e ganhe <span className="text-orange-400 font-semibold">10% OFF</span> + acesso antecipado à Coleção Copa</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input placeholder="seu@email.com" className="input-field text-sm py-2.5 flex-1 sm:w-64" />
            <button className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">Entrar</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-700 border-t border-white/[0.04] pt-6">
          <p>© 2026 ZAYEH. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={11} className="text-orange-500 fill-current" /> no Brasil
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Privacidade</a>
            <a href="#" className="hover:text-gray-400">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
