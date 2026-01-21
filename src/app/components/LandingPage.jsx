"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Home, Zap, BatteryCharging, CheckCircle, ShieldCheck, ArrowRight, Sun, BarChart3, Leaf, DollarSign } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

// --- COMPONENTE DE NÚMEROS ANIMADOS ---
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

  return <span>{count.toLocaleString('pt-BR')}{suffix}</span>;
}

export default function LandingPage() {
  const router = useRouter();

  // --- CONFIGURAÇÕES ---
  const whatsappNumber = "5511940306171";
  const whatsappBase = `https://wa.me/${whatsappNumber}`;
  const instagramLink = "https://www.instagram.com/veloxsolar.pompeiahome/";
  const emailLink = "mailto:saopaulo.pompeia@veloxsolarenergia.com.br";
  const webhookUrl = "https://hook.us2.make.com/6xwyjwejrjvweam1akefa9u35sv72j5g"; 

  // --- FUNÇÃO PIXEL ---
  const trackPixel = (eventName, params = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq('track', eventName, params);
    }
    console.log(`📡 Pixel Disparado: ${eventName}`, params);
  };

  // --- REDIRECIONAMENTO ---
  const handleWhatsAppClick = (origin) => {
    trackPixel('Contact', { content_name: origin });
    window.open(whatsappBase, '_blank');
  };

  // --- ESTADOS DO QUIZ ---
  const [step, setStep] = useState(1);
  const [loadingBar, setLoadingBar] = useState(0);
  const [sendingLead, setSendingLead] = useState(false);
  const [answers, setAnswers] = useState({ faixaConta: "", objetivo: "", nome: "", telefone: "" });

  // --- LÓGICA DO QUIZ ---
  const handleOptionClick = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    trackPixel('ViewContent', { content_name: `Quiz Step ${step}: ${value}` });
    
    if (step === 1) {
        setStep(2);
    } else if (step === 2) {
        setStep(3);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setLoadingBar(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setStep(4);
                trackPixel('InitiateCheckout', { content_name: 'Quiz Ready for Lead' });
            }
        }, 40);
    }
  };

  const handleQuizSubmit = async () => {
    if (!answers.nome || !answers.telefone) return alert("Por favor, preencha seus dados para receber o resultado.");
    
    setSendingLead(true);
    
    // Envia Webhook
    const leadData = {
        data_criacao: new Date().toLocaleString("pt-BR"),
        origem: "Landing Page Quiz (Projeto 1)",
        ...answers
    };

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadData)
        });
    } catch (e) { console.error(e); }

    trackPixel('Lead');

    // Monta texto e abre WhatsApp
    const text = `*Olá! Fiz o Quiz Solar e fui aprovado.* ✅\n\n💰 Faixa de Conta: ${answers.faixaConta}\n🎯 Objetivo: ${answers.objetivo}\n\n👤 *MEUS DADOS:*\nNome: ${answers.nome}\n\nGostaria de ver o estudo completo!`;
    window.open(`${whatsappBase}?text=${encodeURIComponent(text)}`, '_blank');
    
    setSendingLead(false);
  };

  // Referências para animações
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(null);
  const toggleIndex = (index) => setOpenIndex(openIndex === index ? null : index);

  // --- DADOS ---
  const stats = [
    { label: "Economia Garantida", value: 95, suffix: "%", duration: 2000, icon: "📉" },
    { label: "Anos de Garantia", value: 25, suffix: "+", duration: 2500, icon: "🛡️" },
    { label: "Projetos Instalados", value: 1000, suffix: "+", duration: 1500, icon: "🏠" },
  ];

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

  return (
    // ADICIONEI overflow-x-hidden AQUI PARA CORRIGIR O SCROLL LATERAL
    <div className="min-h-screen bg-[#0B0D17] text-white font-sans selection:bg-[#00FF88] selection:text-black overflow-x-hidden">

      {/* BOTÃO FLUTUANTE (FIXO) */}
      <button 
        onClick={() => handleWhatsAppClick('Botão Flutuante Fixo')}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebc57] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 flex items-center gap-3 group border-2 border-transparent hover:border-white"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-lg">
          Falar no WhatsApp
        </span>
      </button>

      {/* ================= HERO SECTION COM QUIZ ================= */}
      <section className="relative min-h-[100vh] flex items-center pt-20 pb-12 overflow-hidden">
        
        {/* Imagem de Fundo (Mesma da outra) */}
        <div className="absolute inset-0 z-0">
            <Image src="/hero-solar.webp" alt="Fundo Solar" fill className="object-cover opacity-50" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D17] via-[#0B0D17]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0D17]" />
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            
            {/* TEXTO HERO */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] text-sm font-bold mb-6">
                    <Sun size={16} /> Programa Energia Limpa 2026
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Descubra se sua casa está apta para <span className="text-[#00FF88]">Energia Solar</span>
                </h1>
                <p className="text-gray-300 text-lg mb-8 max-w-lg">
                    Pare de alugar energia. Responda a 3 perguntas rápidas e veja se você se qualifica para zerar sua conta com a Velox.
                </p>
                <div className="flex flex-col gap-3 text-gray-400 text-sm mb-8">
                    <div className="flex items-center gap-3"><CheckCircle className="text-green-500" size={20}/> Análise de viabilidade gratuita</div>
                    <div className="flex items-center gap-3"><CheckCircle className="text-green-500" size={20}/> Instalação certificada e rápida</div>
                </div>

                {/* BOTÃO CTA HERO */}
                <button 
                    onClick={() => handleWhatsAppClick('Botão Hero Principal')}
                    className="inline-flex items-center gap-3 bg-[#00FF88] text-black font-extrabold py-4 px-8 rounded-full hover:bg-[#00e67a] transition-all shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-105"
                >
                    <FaWhatsapp size={24}/> Falar com Especialista Agora
                </button>
            </motion.div>

            {/* QUIZ INTERATIVO (Lado Direito) */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-[#141826]/90 backdrop-blur-xl border border-[#00FF88]/20 rounded-3xl p-8 shadow-2xl shadow-[#00FF88]/10"
            >
                <AnimatePresence mode="wait">
                    
                    {/* PASSO 1 */}
                    {step === 1 && (
                        <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold text-gray-500 uppercase">Etapa 1 de 3</span>
                                <div className="h-2 w-1/3 bg-gray-700 rounded-full"><div className="h-full w-1/3 bg-[#00FF88] rounded-full"></div></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-6">Qual o valor médio da sua conta?</h3>
                            <div className="space-y-3">
                                {["R$ 200 a R$ 400", "R$ 401 a R$ 800", "Acima de R$ 800"].map((opt) => (
                                    <button key={opt} onClick={() => handleOptionClick('faixaConta', opt)} className="w-full text-left p-4 rounded-xl border border-gray-700 bg-[#0B0D17] hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-all flex justify-between group">
                                        <span className="font-medium group-hover:text-[#00FF88] transition">{opt}</span><ArrowRight className="text-gray-600 group-hover:text-[#00FF88]" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* PASSO 2 */}
                    {step === 2 && (
                        <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold text-gray-500 uppercase">Etapa 2 de 3</span>
                                <div className="h-2 w-1/3 bg-gray-700 rounded-full"><div className="h-full w-2/3 bg-[#00FF88] rounded-full"></div></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-6">Qual seu maior objetivo?</h3>
                            <div className="space-y-3">
                                {[ { txt: "Economizar Dinheiro", icon: DollarSign }, { txt: "Valorizar o Imóvel", icon: Home }, { txt: "Ficar Livre de Aumentos", icon: ShieldCheck } ].map((opt) => (
                                    <button key={opt.txt} onClick={() => handleOptionClick('objetivo', opt.txt)} className="w-full text-left p-4 rounded-xl border border-gray-700 bg-[#0B0D17] hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-all flex items-center gap-4 group">
                                        <div className="bg-[#00FF88]/20 p-2 rounded-lg text-[#00FF88]"><opt.icon size={20}/></div>
                                        <span className="font-medium group-hover:text-[#00FF88] transition">{opt.txt}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* PASSO 3: LOADING */}
                    {step === 3 && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                            <h3 className="text-xl font-bold mb-4 animate-pulse">Analisando viabilidade técnica...</h3>
                            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                                <motion.div className="bg-[#00FF88] h-full" initial={{ width: 0 }} animate={{ width: `${loadingBar}%` }} />
                            </div>
                            <p className="text-gray-400 text-sm">Verificando irradiação solar na região...</p>
                        </motion.div>
                    )}

                    {/* PASSO 4: LEAD */}
                    {step === 4 && (
                        <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-500 rounded-full mb-4 border border-green-500/50"><ShieldCheck size={32} /></div>
                                <h3 className="text-2xl font-bold text-white">Perfil Compatível!</h3>
                                <p className="text-gray-400 text-sm">Receba seu estudo de viabilidade grátis.</p>
                            </div>
                            <div className="space-y-4">
                                <input type="text" placeholder="Seu Nome" value={answers.nome} onChange={(e) => setAnswers({...answers, nome: e.target.value})} className="w-full p-4 rounded-xl bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none text-white transition" />
                                <input type="tel" placeholder="Seu WhatsApp" value={answers.telefone} onChange={(e) => setAnswers({...answers, telefone: e.target.value})} className="w-full p-4 rounded-xl bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none text-white transition" />
                                <button onClick={handleQuizSubmit} disabled={sendingLead} className="w-full bg-[#00FF88] text-black font-bold py-4 rounded-xl hover:bg-[#00e67a] transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2">
                                    {sendingLead ? "Enviando..." : <><FaWhatsapp size={20}/> Ver Meu Resultado</>}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">Seus dados estão protegidos.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section ref={statsRef} className="py-20 bg-[#0E111C] border-y border-gray-800">
        <div className="container mx-auto grid md:grid-cols-3 gap-12 px-6 text-center">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:i*0.2}}>
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-5xl font-bold text-white mb-2"><AnimatedNumber value={stat.value} suffix={stat.suffix} duration={stat.duration} start={statsInView} /></h3>
                <p className="text-[#00FF88] uppercase tracking-wider font-semibold text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= POR QUE A VELOX (COM FOTO) ================= */}
      <section className="py-24 bg-[#0B0D17]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
            <motion.div className="lg:w-1/2" initial={{opacity:0, x:-50}} whileInView={{opacity:1, x:0}}>
                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <Image src="/solar-texto.jpeg" alt="Instalação Profissional" fill className="object-cover hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8"><p className="text-white font-medium">Equipe própria certificada em todo o Brasil.</p></div>
                </div>
            </motion.div>
            <motion.div className="lg:w-1/2 space-y-8" initial={{opacity:0, x:50}} whileInView={{opacity:1, x:0}}>
                <div><h2 className="text-4xl font-bold mb-4">Engenharia de Ponta</h2><p className="text-gray-400 text-lg">Não vendemos apenas placas. Entregamos uma solução completa de engenharia energética para zerar sua conta com segurança.</p></div>
                <div className="space-y-4">
                    {[ "Equipamentos Tier-1 (Top Global)", "Monitoramento via App 24h", "Suporte Técnico Vitalício" ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#141826] border border-gray-800 hover:border-[#00FF88] transition-colors items-center">
                            <CheckCircle className="text-[#00FF88]" size={24}/>
                            <span className="text-white font-bold text-lg">{item}</span>
                        </div>
                    ))}
                </div>
                {/* BOTÃO CTA INTERMEDIÁRIO */}
                <button onClick={() => handleWhatsAppClick('Botão Seção Quem Somos')} className="px-8 py-3 border border-[#00FF88] text-[#00FF88] rounded-full hover:bg-[#00FF88] hover:text-black transition font-bold">
                    Conhecer a Empresa
                </button>
            </motion.div>
        </div>
      </section>

      {/* ================= BENEFÍCIOS ================= */}
      <section className="py-24 bg-[#0E111C]">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">O Sol Trabalha Para Você</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[ 
                    { icon: Leaf, title: "Sustentabilidade", desc: "Produza energia limpa e reduza a emissão de CO2." },
                    { icon: BarChart3, title: "Retorno Financeiro", desc: "Payback médio de 3 a 4 anos. Depois é só lucro." },
                    { icon: Home, title: "Valorização", desc: "Seu imóvel vale até 10% mais com energia solar instalada." }
                ].map((item, i) => (
                    <motion.div key={i} whileHover={{y:-10}} className="bg-[#0B0D17] p-8 rounded-2xl border border-gray-800 hover:border-[#00FF88] transition-all group">
                        <item.icon className="w-12 h-12 text-[#00FF88] mb-6 group-hover:scale-110 transition-transform mx-auto"/>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
            {/* BOTÃO CTA BENEFÍCIOS */}
            <div className="mt-12">
                 <button onClick={() => handleWhatsAppClick('Botão Seção Benefícios')} className="inline-flex items-center gap-2 bg-[#00FF88] text-black font-bold py-3 px-8 rounded-full hover:bg-[#00e67a] transition-all shadow-lg">
                     <FaWhatsapp size={20} /> Quero Esses Benefícios
                 </button>
            </div>
        </div>
      </section>

      {/* ================= FAQ COMPLETO (10 PERGUNTAS) ================= */}
      <section className="py-24 bg-[#0B0D17]">
        <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Dúvidas Comuns</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-800 rounded-xl bg-[#141826] overflow-hidden">
                        <button onClick={() => toggleIndex(i)} className="w-full flex justify-between items-center p-5 text-left font-semibold hover:bg-gray-800 transition">{faq.question}<span className="text-[#00FF88] text-2xl">{openIndex === i ? "−" : "+"}</span></button>
                        <AnimatePresence>{openIndex === i && (<motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden"><div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800">{faq.answer}</div></motion.div>)}</AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ================= RODAPÉ ================= */}
      <footer className="bg-black py-12 border-t border-gray-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left"><h4 className="text-2xl font-bold text-white mb-2">VELOX SOLAR</h4><p className="text-gray-500 text-sm">Energia inteligente para um futuro sustentável.</p></div>
            <div className="flex gap-6">
                <button onClick={() => handleWhatsAppClick('Icone Footer Zap')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#00FF88] hover:text-black transition"><FaWhatsapp/></button>
                <a href={instagramLink} target="_blank" onClick={() => trackPixel('Contact', { content_name: 'Instagram Footer' })} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-pink-600 transition"><FaInstagram/></a>
                <a href={emailLink} onClick={() => trackPixel('Contact', { content_name: 'Email Footer' })} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition"><FaEnvelope/></a>
            </div>
        </div>
        <div className="text-center text-gray-600 text-xs mt-12">© 2026 Velox Solar. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}