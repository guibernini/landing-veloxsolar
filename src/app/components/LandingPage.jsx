"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Home, Building, Factory, Building2, Tractor } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

// Números animados
function AnimatedNumber({ value, suffix, duration, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startVal = 0;
    const stepTime = 20;
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = value / totalSteps;

    const interval = setInterval(() => {
      startVal += increment;
      if (startVal >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(startVal));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [start, value, duration]);

  return <span>{count}{suffix}</span>;
}

export default function LandingPage() {
  const stats = [
    { label: "Redução na Conta de Luz", value: 95, suffix: "%", duration: 2000, icon: "💡" },
    { label: "Anos de Garantia", value: 25, suffix: "+", duration: 2500, icon: "🛠️" },
    { label: "Energia Disponível", value: 24, suffix: "/7", duration: 1500, icon: "⚡" },
  ];

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", endereco: "", descricao: "" });
  const [openIndex, setOpenIndex] = useState(null);
  const toggleIndex = (index) => setOpenIndex(openIndex === index ? null : index);

  const faqs = [
    { question: "1. Quais os benefícios da Cooperativa de Energia?", answer: "A Cooperativa oferece redução significativa na conta de energia, acesso a energia limpa e renovável, e participação nos créditos gerados pela usina." },
    { question: "2. Preciso fazer algum investimento?", answer: "O cooperado precisa apenas assinar o contrato e, dependendo do modelo, contribuir com uma taxa simbólica para manutenção da usina." },
    { question: "3. O que é necessário para participar da Cooperativa?", answer: "É necessário ser pessoa física ou jurídica, residir ou atuar na área de atendimento da usina, e preencher o cadastro da cooperativa." },
    { question: "4. Como faço se minha empresa quiser sair da Cooperativa? É cobrado multa?", answer: "O cooperado pode solicitar a saída a qualquer momento. Não há multa, mas créditos acumulados não utilizados podem ser perdidos." },
    { question: "5. Se houver algum problema ou indisponibilidade momentânea na usina, ficarei sem energia?", answer: "Não. A cooperativa mantém contrato com a rede local para garantir fornecimento contínuo, mesmo em caso de falhas temporárias na usina." },
    { question: "6. Se a Cooperativa não gerar os créditos de energia em algum mês, o que acontece?", answer: "Os créditos não gerados não são cobrados do cooperado e são compensados nos meses seguintes, de acordo com a produção da usina." },
    { question: "7. Como é feita a divisão e distribuição da energia entre os cooperados?", answer: "A energia gerada é proporcional à cota de cada cooperado, garantindo que todos recebam sua parte conforme contrato." },
    { question: "8. Haverá uma rede elétrica exclusiva da usina até o meu estabelecimento?", answer: "Não. A distribuição é feita através da rede existente, sem necessidade de construção de linha exclusiva." },
    { question: "9. Precisarei fazer alguma alteração física, obra ou reforma no meu estabelecimento para começar a receber a energia da usina?", answer: "Na maioria dos casos não é necessária nenhuma alteração, apenas ajustes mínimos na medição e conexão à rede." },
    { question: "10. Meu desconto é o mesmo todos os meses?", answer: "O desconto é calculado mensalmente de acordo com a produção da usina e consumo do cooperado, podendo variar ligeiramente." },
  ];

  const whatsappLink = "https://wa.me/5511940306171";
  const instagramLink = "https://www.instagram.com/veloxsolar.pompeiahome/";
  const emailLink = "mailto:saopaulo.pompeia@veloxsolarenergia.com.br";

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const triggerConversion = () => {
    if (typeof gtag !== "undefined") {
      gtag('event', 'conversion', {
        'send_to': 'AW-17791443438/q-NqCPPHz9UbEO7Dz6NC'
      });
    }
  };

  const handleClick = () => {
    triggerConversion();
    window.open(whatsappLink, "_blank");
    setTimeout(() => {
      window.location.href = "/obrigado";
    }, 500); // 0,5 segundos
  };

  return (
    <div className="min-h-screen text-white font-poppins relative">

      {/* Botão fixo */}
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2"
      >
        <FaWhatsapp /> Fale com um Profissional
      </button>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center">
        <Image src="/hero-solar.webp" alt="Energia Solar" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl px-6 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Energia Solar que Transforma o Seu Mundo</h1>
          <p className="text-xl text-gray-200 mb-10">Economia, sustentabilidade e retorno garantido.</p>
          <button
            onClick={handleClick}
            className="bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-xl hover:bg-yellow-400 transition"
          >
            Fale com a Velox Solar
          </button>
        </div>
      </section>

      {/* ENERGIA SOLAR PARA CADA NECESSIDADE */}
      <section className="py-20 bg-[#0B0D17] text-white text-center">
        <h2 className="text-4xl font-bold mb-12">Energia Solar para Cada Necessidade</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto px-6">
          {[
            { icon: Home, title: "Residencial", desc: "Reduza sua conta de luz em até 95% com sistemas fotovoltaicos dimensionados para seu lar." },
            { icon: Building, title: "Comercial", desc: "Aumente a competitividade do seu negócio com energia limpa e previsível." },
            { icon: Factory, title: "Industrial", desc: "Otimize custos operacionais com usinas solares de grande porte." },
            { icon: Building2, title: "Condomínios", desc: "Valorize seu patrimônio e reduza despesas condominiais." },
            { icon: Tractor, title: "Área Rural", desc: "Energia confiável para produção agrícola e pecuária." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} className="bg-[#141826] p-6 rounded-2xl shadow-lg cursor-pointer"
                initial={{opacity:0, y:50}}
                whileInView={{opacity:1, y:0}}
                viewport={{ once: true }}
                transition={{delay:i*0.2, type:"spring", stiffness:100}}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-12 h-12 text-[#00FF88] mx-auto mb-4"/>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-12">
          <button
            onClick={handleClick}
            className="inline-block bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl hover:bg-yellow-400 transition animate-pulse"
          >
            Fale com a Velox Solar
          </button>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="py-20 bg-[#0D1B2A] text-white text-center">
        <h2 className="text-5xl font-bold mb-12">Quem Somos</h2>
        <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="relative w-80 h-80"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/cards-solar.webp" alt="Projetos solares" fill className="object-cover rounded-2xl"/>
            </motion.div>
            <div className="text-lg md:text-xl leading-relaxed space-y-4 max-w-md text-left">
              <p><strong>Mais de 10.000 projetos instalados</strong> em todo o país, oferecendo soluções de alta qualidade e eficiência.</p>
              <p><strong>Referência no mercado</strong> de energia solar, com reconhecimento por clientes e parceiros.</p>
              <p><strong>Confiança garantida</strong>, cada projeto é executado com cuidado, segurança e compromisso com resultados.</p>
              <div className="mt-6">
                <button
                  onClick={handleClick}
                  className="bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-xl hover:bg-yellow-400 transition"
                >
                  Fale com a Velox Solar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NÚMEROS ANIMADOS */}
      <section ref={statsRef} className="py-20 bg-[#0B0D17] text-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <motion.div key={i} className="bg-[#141826] p-8 rounded-2xl shadow-lg flex flex-col items-center gap-3"
              initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}}
              viewport={{ once:true }}
              transition={{delay:i*0.2, type:"spring", stiffness:100}}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-[#00FF88] mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} duration={stat.duration} start={statsInView} />
              </h3>
              <p className="text-gray-300 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO + POR QUE ESCOLHER */}
      <section className="py-20 bg-[#0E111C] text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12">

          {/* Form */}
          <motion.div className="flex-1 bg-[#141826] p-8 rounded-2xl shadow-lg"
            initial={{opacity:0, x:-50}} animate={{opacity:1, x:0}} transition={{duration:0.6}}
          >
            <h2 className="text-3xl font-bold mb-6">Entre em contato</h2>
            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
              <input type="text" placeholder="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} className="p-4 rounded-lg bg-[#0E111C] border border-gray-700" />
              <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="p-4 rounded-lg bg-[#0E111C] border border-gray-700" />
              <input type="tel" placeholder="Telefone" value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} className="p-4 rounded-lg bg-[#0E111C] border border-gray-700" />
              <input type="text" placeholder="Endereço" value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})} className="p-4 rounded-lg bg-[#0E111C] border border-gray-700" />
              <textarea placeholder="Descrição do serviço" rows={4} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} className="p-4 rounded-lg bg-[#0E111C] border border-gray-700"></textarea>
              <button type="submit" className="bg-yellow-500 text-black font-bold py-4 px-6 rounded-full hover:bg-yellow-400 transition animate-pulse">
                Enviar
              </button>
            </form>
          </motion.div>

          {/* Por que escolher */}
          <motion.div className="flex-1 grid gap-6"
            initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} transition={{duration:0.6}}
          >
            <h2 className="text-3xl font-bold mb-6">Por que escolher nossa empresa?</h2>
            {[
              { title: "Consultoria Especializada", desc: "Análise detalhada do seu consumo e desenvolvimento de projeto personalizado para máxima eficiência." },
              { title: "Tecnologia de Ponta", desc: "Equipamentos de alta qualidade com garantia estendida e máxima durabilidade." },
              { title: "Instalação Profissional", desc: "Equipe técnica certificada e experiente para implementação segura e eficiente." },
              { title: "Suporte Contínuo", desc: "Monitoramento remoto, manutenção preventiva e atendimento sempre que você precisar." },
              { title: "Retorno Garantido", desc: "Investimento que se paga em poucos anos e gera economia por décadas." },
            ].map((item, i) => (
              <div key={i} className="bg-[#141826] p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0E111C] text-white text-center">
        <h2 className="text-4xl font-bold mb-10">Perguntas Frequentes</h2>
        <div className="max-w-4xl mx-auto text-left space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="bg-[#141826] rounded-2xl p-4 cursor-pointer"
              onClick={() => toggleIndex(i)}
              initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}}
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div className="mt-2 text-gray-300 overflow-hidden"
                    initial={{opacity:0, height:0}}
                    animate={{opacity:1, height:"auto"}}
                    exit={{opacity:0, height:0}}
                    transition={{duration:0.3}}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={handleClick}
            className="inline-block bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl hover:bg-yellow-400 transition animate-pulse"
          >
            Fale com a Velox Solar
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-400 flex flex-col items-center gap-3 bg-[#0B0D17]">
        <p>© 2025 Velox Solar. Todos os direitos reservados.</p>
        <div className="flex gap-6 text-2xl">
          <a href={whatsappLink} target="_blank"><FaWhatsapp /></a>
          <a href={instagramLink} target="_blank"><FaInstagram /></a>
          <a href={emailLink}><FaEnvelope /></a>
        </div>
      </footer>

    </div>
  );
}
