"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Home, Zap, BatteryCharging, CheckCircle, ShieldCheck, ArrowRight, Sun, BarChart3, Leaf, DollarSign, Phone, Mail, MapPin, Clock } from "lucide-react";
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
  const whatsappNumber = "5511951569352"; 
  const whatsappBase = `https://wa.me/${whatsappNumber}`;
  const instagramLink = "https://www.instagram.com/veloxsolar.pompeiahome/";
  const emailLink = "mailto:saopaulo.pompeia@veloxsolarenergia.com.br";
  
  // ✅ WEBHOOK ATUALIZADO
  const webhookUrl = "https://hook.us2.make.com/hcstumoeycg1xhdy9q4uk4r07kpzytij"; 
  
  // ✅ ID DO GOOGLE ADS
  const googleAdsId = "AW-17791443438"; 
  // ✅ RÓTULO DE CONVERSÃO
  const conversionLabel = "AW-17791443438/q-NqCPPHz9UbEO7Dz6NC";

  // --- FUNÇÃO DE RASTREAMENTO CORRIGIDA ---
  const trackConversion = (eventName, params = {}) => {
    if (typeof window !== "undefined") {
      if (window.fbq) {
        window.fbq('track', eventName, params);
        console.log(`📡 FB Pixel: ${eventName}`);
      }
      if (window.gtag) {
        const sendTo = (eventName === 'Contact' || eventName === 'Lead') 
                        ? conversionLabel 
                        : googleAdsId;
                        
        const googleEventName = eventName === 'InitiateCheckout' ? 'begin_checkout' : 'conversion';

        window.gtag('event', googleEventName, {
            'send_to': sendTo,
            'event_callback': () => console.log(`📡 Google Ads: Enviado para ${sendTo}`)
        });
      }
    }
  };

  const redirectToThankYou = (finalUrl, originName, skipTracking = false) => {
    if (!skipTracking) {
      trackConversion('Contact', { content_name: originName });
    }
    localStorage.setItem("velox_redirect", finalUrl);
    router.push("/obrigado");
  };

  const handleWhatsAppClick = (origin) => {
      const message = "Olá! Gostaria de saber mais sobre energia solar e fazer um orçamento.";
      const finalUrl = `${whatsappBase}?text=${encodeURIComponent(message)}`;
      redirectToThankYou(finalUrl, origin);
  };

  // --- ESTADOS DO QUIZ ---
  const [step, setStep] = useState(1);
  const [loadingBar, setLoadingBar] = useState(0);
  const [sendingLead, setSendingLead] = useState(false);
  const [answers, setAnswers] = useState({ faixaConta: "", objetivo: "", nome: "", telefone: "" });

  const handleOptionClick = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: `Quiz Step ${step}: ${value}` });
    }
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
                trackConversion('InitiateCheckout', { content_name: 'Quiz Ready for Lead' });
            }
        }, 40);
    }
  };

  const handleQuizSubmit = async () => {
    if (!answers.nome || !answers.telefone) return alert("Por favor, preencha seus dados para receber o resultado.");
    setSendingLead(true);
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
    
    trackConversion('Lead', { content_name: 'Quiz Finalizado' });
    
    const text = `*Olá! Fiz o Quiz Solar e fui aprovado.* ✅\n\n💰 Faixa de Conta: ${answers.faixaConta}\n🎯 Objetivo: ${answers.objetivo}\n\n👤 *MEUS DADOS:*\nNome: ${answers.nome}\n\nGostaria de ver o estudo completo!`;
    const finalUrl = `${whatsappBase}?text=${encodeURIComponent(text)}`;
    
    redirectToThankYou(finalUrl, 'Quiz Finalizado', true);
    setSendingLead(false);
  };

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(null);
  const toggleIndex = (index) => setOpenIndex(openIndex === index ? null : index);

  const stats = [
    { label: "Economia Garantida", value: 95, suffix: "%", duration: 2000, icon: "📉" },
    { label: "Anos de Garantia", value: 25, suffix: "+", duration: 2500, icon: "🛡️" },
    { label: "Projetos Instalados", value: 1000, suffix: "+", duration: 1500, icon: "🏠" },
  ];

  const faqs = [
    { question: "1. Quanto custa para instalar?", answer: "Hoje é possível financiar 100% do projeto. Basicamente, você troca o valor que paga na conta de luz pela parcela do seu próprio sistema. Quando o financiamento acaba, a energia é grátis." },
    { question: "2. Funciona em dias nublados ou chuva?", answer: "Sim! Os painéis continuam gerando energia com a claridade do dia (radiação difusa). Além disso, o que você gera a mais nos dias de sol vira crédito para usar a noite ou em dias chuvosos." },
    { question: "3. Demora muito para instalar?", answer: "Não. Nossa instalação é expressa. Após a aprovação da concessionária, a montagem física no telhado leva geralmente de 2 a 3 dias para residências." },
    { question: "4. Valoriza meu imóvel?", answer: "Com certeza. Pesquisas mostram que imóveis com energia solar própria valorizam entre 6% e 10%, além de venderem muito mais rápido." },
    { question: "5. E se der problema técnico?", answer: "A Velox monitora seu sistema 24h via aplicativo. Se houver qualquer falha, nossa equipe técnica é acionada. Além disso, os equipamentos têm 25 anos de garantia de performance." },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white font-sans selection:bg-[#00FF88] selection:text-black overflow-x-hidden">

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
        <div className="absolute inset-0 z-0">
            <Image src="/hero-solar.webp" alt="Fundo Solar" fill className="object-cover opacity-50" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D17] via-[#0B0D17]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0D17]" />
        </div>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] text-sm font-bold mb-6"><Sun size={16} /> Programa Energia Limpa 2026</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Descubra se sua casa está apta para <span className="text-[#00FF88]">Energia Solar</span></h1>
                <p className="text-gray-300 text-lg mb-8 max-w-lg">Pare de alugar energia. Responda a 3 perguntas rápidas e veja se você se qualifica para zerar sua conta com a Velox.</p>
                <div className="flex flex-col gap-3 text-gray-400 text-sm mb-8">
                    <div className="flex items-center gap-3"><CheckCircle className="text-green-500" size={20}/> Análise de viabilidade gratuita</div>
                    <div className="flex items-center gap-3"><CheckCircle className="text-green-500" size={20}/> Instalação certificada e rápida</div>
                </div>
                <button onClick={() => handleWhatsAppClick('Botão Hero Principal')} className="inline-flex items-center gap-3 bg-[#00FF88] text-black font-extrabold py-4 px-8 rounded-full hover:bg-[#00e67a] transition-all shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-105">
                    <FaWhatsapp size={24}/> Falar com Especialista Agora
                </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-[#141826]/90 backdrop-blur-xl border border-[#00FF88]/20 rounded-3xl p-8 shadow-2xl shadow-[#00FF88]/10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex justify-between items-center mb-6"><span className="text-xs font-bold text-gray-500 uppercase">Etapa 1 de 3</span><div className="h-2 w-1/3 bg-gray-700 rounded-full"><div className="h-full w-1/3 bg-[#00FF88] rounded-full"></div></div></div>
                            <h3 className="text-2xl font-bold mb-6">Qual o valor médio da sua conta?</h3>
                            <div className="space-y-3">{["R$ 200 a R$ 400", "R$ 401 a R$ 800", "Acima de R$ 800"].map((opt) => (<button key={opt} onClick={() => handleOptionClick('faixaConta', opt)} className="w-full text-left p-4 rounded-xl border border-gray-700 bg-[#0B0D17] hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-all flex justify-between group"><span className="font-medium group-hover:text-[#00FF88] transition">{opt}</span><ArrowRight className="text-gray-600 group-hover:text-[#00FF88]" /></button>))}</div>
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex justify-between items-center mb-6"><span className="text-xs font-bold text-gray-500 uppercase">Etapa 2 de 3</span><div className="h-2 w-1/3 bg-gray-700 rounded-full"><div className="h-full w-2/3 bg-[#00FF88] rounded-full"></div></div></div>
                            <h3 className="text-2xl font-bold mb-6">Qual seu maior objetivo?</h3>
                            <div className="space-y-3">{[ { txt: "Economizar Dinheiro", icon: DollarSign }, { txt: "Valorizar o Imóvel", icon: Home }, { txt: "Ficar Livre de Aumentos", icon: ShieldCheck } ].map((opt) => (<button key={opt.txt} onClick={() => handleOptionClick('objetivo', opt.txt)} className="w-full text-left p-4 rounded-xl border border-gray-700 bg-[#0B0D17] hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-all flex items-center gap-4 group"><div className="bg-[#00FF88]/20 p-2 rounded-lg text-[#00FF88]"><opt.icon size={20}/></div><span className="font-medium group-hover:text-[#00FF88] transition">{opt.txt}</span></button>))}</div>
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><h3 className="text-xl font-bold mb-4 animate-pulse">Analisando viabilidade técnica...</h3><div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-2"><motion.div className="bg-[#00FF88] h-full" initial={{ width: 0 }} animate={{ width: `${loadingBar}%` }} /></div><p className="text-gray-400 text-sm">Verificando irradiação solar na região...</p></motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-500 rounded-full mb-4 border border-green-500/50"><ShieldCheck size={32} /></div><h3 className="text-2xl font-bold text-white">Perfil Compatível!</h3><p className="text-gray-400 text-sm">Receba seu estudo de viabilidade grátis.</p></div>
                            <div className="space-y-4">
                                <input type="text" placeholder="Seu Nome" value={answers.nome} onChange={(e) => setAnswers({...answers, nome: e.target.value})} className="w-full p-4 rounded-xl bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none text-white transition" />
                                <input type="tel" placeholder="Seu WhatsApp" value={answers.telefone} onChange={(e) => setAnswers({...answers, telefone: e.target.value})} className="w-full p-4 rounded-xl bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none text-white transition" />
                                <button onClick={handleQuizSubmit} disabled={sendingLead} className="w-full bg-[#00FF88] text-black font-bold py-4 rounded-xl hover:bg-[#00e67a] transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2">{sendingLead ? "Enviando..." : <><FaWhatsapp size={20}/> Ver Meu Resultado</>}</button>
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

      {/* ================= POR QUE A VELOX ================= */}
      <section className="py-24 bg-[#0B0D17]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
                <div className="relative h-[300px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <img 
                        src="/solar-texto.jpeg" 
                        alt="Instalação Profissional" 
                        className="w-full h-full object-cover hover:scale-105 transition duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8"><p className="text-white font-medium">Equipe própria certificada em todo o Brasil.</p></div>
                </div>
            </div>
            
            <motion.div className="lg:w-1/2 space-y-8" initial={{opacity:0, x:50}} whileInView={{opacity:1, x:0}} viewport={{ once: true }}>
                <div><h2 className="text-4xl font-bold mb-4">Engenharia de Ponta</h2><p className="text-gray-400 text-lg">Não vendemos apenas placas. Entregamos uma solução completa de engenharia energética para zerar sua conta com segurança.</p></div>
                <div className="space-y-4">
                    {[ "Equipamentos Tier-1 (Top Global)", "Monitoramento via App 24h", "Suporte Técnico Vitalício" ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#141826] border border-gray-800 hover:border-[#00FF88] transition-colors items-center">
                            <CheckCircle className="text-[#00FF88]" size={24}/>
                            <span className="text-white font-bold text-lg">{item}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleWhatsAppClick('Botão Seção Quem Somos')} className="px-8 py-3 border border-[#00FF88] text-[#00FF88] rounded-full hover:bg-[#00FF88] hover:text-black transition font-bold">Conhecer a Empresa</button>
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
            <div className="mt-12"><button onClick={() => handleWhatsAppClick('Botão Seção Benefícios')} className="inline-flex items-center gap-2 bg-[#00FF88] text-black font-bold py-3 px-8 rounded-full hover:bg-[#00e67a] transition-all shadow-lg"><FaWhatsapp size={20} /> Quero Esses Benefícios</button></div>
        </div>
      </section>

      {/* ================= FAQ COM BOTÃO NA ESQUERDA ================= */}
      <section className="py-24 bg-[#0B0D17]">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Dúvidas Comuns</h2>
                <p className="text-gray-400 mt-2">Tudo o que você precisa saber antes de investir.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                
                {/* COLUNA ESQUERDA: PERGUNTAS + BOTÃO */}
                <div className="flex flex-col gap-8">
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-800 rounded-xl bg-[#141826] overflow-hidden">
                                <button onClick={() => toggleIndex(i)} className="w-full flex justify-between items-center p-5 text-left font-semibold hover:bg-gray-800 transition">{faq.question}<span className="text-[#00FF88] text-2xl">{openIndex === i ? "−" : "+"}</span></button>
                                <AnimatePresence>{openIndex === i && (<motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden"><div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800">{faq.answer}</div></motion.div>)}</AnimatePresence>
                            </div>
                        ))}
                    </div>
                    
                    <div>
                        <button onClick={() => handleWhatsAppClick('Botão FAQ Esquerda')} className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1ebc57] transition-all shadow-lg hover:shadow-green-900/40 flex justify-center items-center gap-2">
                            <FaWhatsapp size={24} /> Tirar Dúvidas com Especialista
                        </button>
                    </div>
                </div>

                {/* COLUNA DIREITA: FOTO ESTILO CARD */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true }}
                    className="relative h-[650px] w-full hidden lg:block rounded-3xl overflow-hidden border border-[#00FF88]/30 shadow-[0_0_50px_rgba(0,255,136,0.15)]"
                >
                    <Image 
                        src="/faq-solar.jpeg" 
                        alt="Equipe Velox Instalando" 
                        fill 
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17]/80 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-[#00FF88] text-black font-bold text-xs inline-block px-3 py-1 rounded-full mb-2">INSTALAÇÃO CERTIFICADA</div>
                        <h3 className="text-2xl font-bold text-white">Segurança Total</h3>
                        <p className="text-gray-300 text-sm mt-1">Nossa equipe cuida de tudo para você só se preocupar em economizar.</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* ================= RODAPÉ PROFISSIONAL ================= */}
      <footer className="bg-[#080a12] pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white tracking-tighter">VELOX<span className="text-[#00FF88]">SOLAR</span></h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Líder em soluções fotovoltaicas. Transformamos telhados em usinas de energia limpa e rentável.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href={instagramLink} target="_blank" onClick={() => trackConversion('Contact', { content_name: 'Instagram Footer' })} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00FF88] hover:text-black transition"><FaInstagram size={18}/></a>
                        <a href={emailLink} onClick={() => trackConversion('Contact', { content_name: 'Email Footer' })} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00FF88] hover:text-black transition"><FaEnvelope size={18}/></a>
                    </div>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-6">Navegação</h5>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#00FF88] transition">Início</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#00FF88] transition">Projetos</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#00FF88] transition">Quem Somos</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#00FF88] transition">Blog Solar</button></li>
                    </ul>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-6">Fale Conosco</h5>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#00FF88] shrink-0 mt-0.5"/>
                            <span>Atendimento em todo o Estado<br/>São Paulo, SP</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-[#00FF88] shrink-0"/>
                            <span>(11) 95156-9352</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Clock size={18} className="text-[#00FF88] shrink-0"/>
                            <span>Seg - Sex: 08h às 18h</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-6">Transparência</h5>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
                        <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
                        <li><a href="#" className="hover:text-white transition">Trabalhe Conosco</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© 2026 Velox Solar. Todos os direitos reservados.</p>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14}/> Site Seguro e Verificado
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}