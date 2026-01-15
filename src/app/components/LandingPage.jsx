"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Home, Building, Factory, Building2, Tractor, ArrowRight, Calculator, MapPin, Zap, Car, Battery, Leaf, TrendingUp, CheckCircle, HardHat, Headset } from "lucide-react";
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

  // --- FUNÇÃO PARA DISPARAR PIXEL ---
  const trackPixel = (eventName, params = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq('track', eventName, params);
      console.log(`Pixel Disparado: ${eventName}`, params);
    }
  };

  // Estados da Calculadora
  const [step, setStep] = useState(1);
  const [loadingSim, setLoadingSim] = useState(false);
  
  // Dados do Formuário
  const [formData, setFormData] = useState({
    valorConta: "",
    tipoImovel: "residencial", // residencial, comercial, industrial, rural, condominio
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: ""
  });

  // Resultados da Simulação
  const [simulation, setSimulation] = useState({
    economiaAnual: 0,
    qtdPlacas: 0,
    producaoMensal: 0,
    areaNecessaria: 0,
    contaNova: 0
  });

  // Stats Gerais
  const stats = [
    { label: "Redução na Conta de Luz", value: 95, suffix: "%", duration: 2000, icon: "💡" },
    { label: "Anos de Garantia", value: 25, suffix: "+", duration: 2500, icon: "🛠️" },
    { label: "Energia Disponível", value: 24, suffix: "/7", duration: 1500, icon: "⚡" },
  ];

  // FAQ COMPLETO
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

  const whatsappNumber = "5511940306171"; // Seu número
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const instagramLink = "https://www.instagram.com/veloxsolar.pompeiahome/";
  const emailLink = "mailto:saopaulo.pompeia@veloxsolarenergia.com.br";

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(null);
  const toggleIndex = (index) => setOpenIndex(openIndex === index ? null : index);

  // --- BOTÃO DE WHATSAPP GERAL ---
  const handleClickWhatsApp = (origin = "WhatsApp Global") => {
    trackPixel('Contact', { content_name: origin }); 
    router.push("/obrigado");
    setTimeout(() => {
      window.open(whatsappLink, "_blank");
    }, 500);
  };

  // --- LÓGICA DA CALCULADORA ---
  const handleCalculate = () => {
    const valor = parseFloat(formData.valorConta.replace("R$", "").replace(".", "").replace(",", ".")) || 0;
    
    if (valor < 100) {
      alert("Por favor, insira um valor de conta válido (mínimo R$ 100).");
      return;
    }

    setLoadingSim(true);
    trackPixel('InitiateCheckout', { value: valor, currency: 'BRL', content_category: formData.tipoImovel });
    
    setTimeout(() => {
      const novaConta = Math.max(valor * 0.05, 50); // 95% de economia
      const economiaMensal = valor - novaConta;
      const economiaAnual = economiaMensal * 12;
      
      const kwhNecessario = valor / 0.95; 
      const placas = Math.ceil(kwhNecessario / 60); 
      const area = Math.ceil(placas * 2.5); 
      const producao = Math.floor(placas * 60);

      setSimulation({
        economiaAnual,
        qtdPlacas: placas,
        producaoMensal: producao,
        areaNecessaria: area,
        contaNova: novaConta
      });

      setStep(2);
      setLoadingSim(false);
    }, 800);
  };

  const handleLeadSubmit = () => {
    if(!formData.nome || !formData.telefone) return alert("Por favor, preencha Nome e Whatsapp para ver o resultado.");
    
    trackPixel('Lead', { content_name: 'Simulacao Solar', currency: 'BRL', value: simulation.economiaAnual });
    setStep(3);
  };

  // --- ENVIO FINAL EXCLUSIVAMENTE VIA WHATSAPP ---
  const handleFinalWhatsApp = (e) => {
    e.preventDefault();
    trackPixel('Contact', { content_name: 'WhatsApp Proposta Oficial' });

    const fMoney = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Monta a mensagem formatada
    const text = `*Olá! Fiz uma simulação no site e gostaria da proposta oficial.*

👤 *DADOS DO CLIENTE:*
Nome: ${formData.nome}
Email: ${formData.email}
Cidade: ${formData.cidade} - ${formData.estado}

⚡ *MINHA CONTA:*
Valor Atual: R$ ${formData.valorConta}
Tipo: ${formData.tipoImovel}

📊 *RESULTADO DA SIMULAÇÃO:*
Economia Anual Estimada: ${fMoney(simulation.economiaAnual)}
Placas Estimadas: ${simulation.qtdPlacas}
Área Necessária: ${simulation.areaNecessaria} m²

Aguardo o retorno!`;

    // Abre o WhatsApp
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCurrencyInput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = (value / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setFormData({ ...formData, valorConta: value });
  };

  return (
    <div className="min-h-screen text-white font-poppins relative">

      {/* Botão fixo do WhatsApp */}
      <button 
        onClick={() => handleClickWhatsApp("Botão Flutuante")}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2"
      >
        <FaWhatsapp /> Fale com um Profissional
      </button>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center">
        <Image src="/hero-solar.webp" alt="Energia Solar" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl px-6 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Energia Inteligente e Renovável
          </h1>
          <p className="text-xl text-gray-200 mb-10">
            Da sua casa ao seu carro elétrico. Economia, tecnologia e sustentabilidade em um só lugar.
          </p>
          <button
            onClick={() => document.getElementById('calculadora').scrollIntoView({behavior: 'smooth'})}
            className="bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-xl hover:bg-yellow-400 transition"
          >
            Simular Economia Agora
          </button>
        </div>
      </section>

      {/* ================= SEÇÃO CALCULADORA ================= */}
      <section id="calculadora" className="py-20 bg-[#0E111C] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulador de Economia Velox</h2>
            <p className="text-gray-400">Descubra quanto você vai economizar.</p>
          </div>

          <div className="bg-[#141826] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* ETAPA 1: DADOS DA CONTA */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                  className="p-8 md:p-12 max-w-3xl mx-auto w-full flex flex-col gap-8"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xl font-semibold text-[#00FF88] flex items-center gap-2">
                      <Calculator className="w-6 h-6"/> Qual o valor médio da sua conta?
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">R$</span>
                      <input 
                        type="text" 
                        value={formData.valorConta} 
                        onChange={handleCurrencyInput}
                        placeholder="0,00"
                        className="w-full bg-[#0B0D17] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-2xl font-bold text-white focus:border-[#00FF88] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-xl font-semibold text-[#00FF88]">Tipo do Imóvel?</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: "residencial", label: "Casa", icon: Home },
                        { id: "comercial", label: "Comércio", icon: Building },
                        { id: "industrial", label: "Indústria", icon: Factory },
                        { id: "rural", label: "Rural", icon: Tractor },
                        { id: "condominio", label: "Condomínio", icon: Building2 },
                      ].map((tipo) => {
                        const Icon = tipo.icon;
                        return (
                          <div 
                            key={tipo.id}
                            onClick={() => setFormData({...formData, tipoImovel: tipo.id})}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 text-center
                              ${formData.tipoImovel === tipo.id ? "border-yellow-500 bg-yellow-500/10" : "border-gray-700 hover:border-gray-500"}
                            `}
                          >
                            <Icon className={`w-6 h-6 ${formData.tipoImovel === tipo.id ? "text-yellow-500" : "text-gray-400"}`} />
                            <span className="font-medium text-sm">{tipo.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <button onClick={handleCalculate} disabled={loadingSim} className="mt-4 bg-yellow-500 text-black font-bold py-4 rounded-xl text-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2">
                    {loadingSim ? "Processando..." : <>Calcular Economia <ArrowRight /></>}
                  </button>
                </motion.div>
              )}

              {/* ETAPA 2: DADOS DE CONTATO */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                  className="p-8 md:p-12 max-w-3xl mx-auto w-full flex flex-col gap-6"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-[#00FF88]">Análise Pronta!</h3>
                    <p className="text-gray-400">Informe seus dados para liberar o relatório completo.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Seu Nome" value={formData.nome} onChange={e=>setFormData({...formData, nome:e.target.value})} className="p-4 rounded-lg bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none" />
                    <input type="email" placeholder="Seu Email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="p-4 rounded-lg bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none" />
                    <input type="tel" placeholder="Seu Whatsapp" value={formData.telefone} onChange={e=>setFormData({...formData, telefone:e.target.value})} className="p-4 rounded-lg bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none" />
                    <div className="flex gap-2">
                       <input type="text" placeholder="Cidade" value={formData.cidade} onChange={e=>setFormData({...formData, cidade:e.target.value})} className="flex-1 p-4 rounded-lg bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none" />
                       <input type="text" placeholder="UF" maxLength={2} value={formData.estado} onChange={e=>setFormData({...formData, estado:e.target.value.toUpperCase()})} className="w-24 p-4 rounded-lg bg-[#0B0D17] border border-gray-700 focus:border-[#00FF88] outline-none uppercase" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                     <button onClick={() => setStep(1)} className="flex-1 py-4 border border-gray-600 rounded-xl hover:bg-white/5 transition">Voltar</button>
                     <button onClick={handleLeadSubmit} className="flex-[2] bg-yellow-500 text-black font-bold py-4 rounded-xl text-xl hover:bg-yellow-400 transition">Ver Resultado Agora</button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 3: DASHBOARD */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-6 md:p-10 w-full"
                >
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0B0D17] p-6 rounded-2xl border border-gray-800">
                       <div className="flex items-center gap-3 mb-2 text-gray-400"><TrendingUp className="text-yellow-500"/> Redução Estimada</div>
                       <div className="text-3xl font-bold text-white">Até 95%</div>
                    </div>
                    <div className="bg-[#0B0D17] p-6 rounded-2xl border border-gray-800">
                       <div className="flex items-center gap-3 mb-2 text-gray-400"><span className="text-2xl text-green-500">R$</span> Economia Anual</div>
                       <div className="text-3xl font-bold text-[#00FF88]">R$ {simulation.economiaAnual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div className="bg-[#0B0D17] p-6 rounded-2xl border border-gray-800">
                       <div className="flex items-center gap-3 mb-2 text-gray-400"><span className="text-2xl">⏱️</span> Payback Estimado</div>
                       <div className="text-3xl font-bold text-white">2 a 3 anos</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                    <div className="bg-[#0B0D17] p-6 rounded-2xl border border-gray-800 h-64 flex flex-col justify-between">
                       <h4 className="text-gray-300 font-semibold mb-4">Comparativo Mensal</h4>
                       <div className="flex items-end justify-center gap-16 h-full pb-4">
                          <div className="flex flex-col items-center gap-2 w-24">
                             <div className="w-full bg-red-600 rounded-t-lg relative shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{height: "140px"}}></div>
                             <span className="text-xs text-gray-400 font-bold">Hoje: R$ {formData.valorConta}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 w-24">
                             <div className="w-full bg-yellow-500 rounded-t-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]" style={{height: "20px"}}></div>
                             <span className="text-xs text-[#00FF88] font-bold">Velox: R$ {simulation.contaNova.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       <h4 className="text-xl font-bold mb-2">Dados do Projeto</h4>
                       <div className="bg-[#141826] p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                          <div className="bg-gray-800 p-3 rounded-lg"><Home className="text-yellow-500"/></div>
                          <div><p className="text-sm text-gray-400">Número de Placas</p><p className="text-xl font-bold">{simulation.qtdPlacas} Paineis</p></div>
                       </div>
                       <div className="bg-[#141826] p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                          <div className="bg-gray-800 p-3 rounded-lg"><Zap className="text-yellow-500"/></div>
                          <div><p className="text-sm text-gray-400">Produção Mensal</p><p className="text-xl font-bold">{simulation.producaoMensal} kWh/mês</p></div>
                       </div>
                       <div className="bg-[#141826] p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                          <div className="bg-gray-800 p-3 rounded-lg"><MapPin className="text-yellow-500"/></div>
                          <div><p className="text-sm text-gray-400">Área de Instalação</p><p className="text-xl font-bold">{simulation.areaNecessaria} m²</p></div>
                       </div>
                    </div>
                  </div>
                  {/* BOTÃO FINAL WHATSAPP */}
                  <div className="flex justify-center">
                    <button onClick={handleFinalWhatsApp} className="bg-[#00FF88] text-black font-bold py-5 px-12 rounded-full text-xl hover:scale-105 transition shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center gap-3">
                      <FaWhatsapp className="text-2xl"/> Receber Proposta Oficial
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= SEÇÃO: POR QUE ESCOLHER (ESTICADA) ================= */}
      <section className="py-20 bg-[#0B0D17] text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-stretch gap-12">
          
          <motion.div
            className="flex-1 relative w-full min-h-[400px] lg:min-h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src="/solar-texto.png" 
              alt="Instalação Solar Profissional" 
              fill 
              className="object-cover" 
            />
          </motion.div>

          <motion.div
            className="flex-1 flex flex-col justify-center gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-4xl font-bold mb-4">Por que escolher a Velox Solar?</h2>
              <p className="text-gray-400">Mais do que painéis, entregamos uma parceria estratégica para o seu futuro energético.</p>
            </div>

            <div className="grid gap-4">
              {[
                { title: "Consultoria Especializada", desc: "Análise detalhada do seu consumo e desenvolvimento de projeto personalizado para máxima eficiência.", icon: CheckCircle },
                { title: "Tecnologia de Ponta", desc: "Equipamentos de alta qualidade com garantia estendida e máxima durabilidade.", icon: Zap },
                { title: "Instalação Profissional", desc: "Equipe técnica certificada e experiente para implementação segura e eficiente.", icon: HardHat },
                { title: "Suporte Contínuo", desc: "Monitoramento remoto, manutenção preventiva e atendimento sempre que você precisar.", icon: Headset },
                { title: "Retorno Garantido", desc: "Investimento que se paga em poucos anos e gera economia por décadas.", icon: TrendingUp },
              ].map((item, i) => {
                 const Icon = item.icon;
                 return (
                <div key={i} className="bg-[#141826] p-6 rounded-2xl border border-gray-800 flex gap-4 hover:border-[#00FF88] transition items-start">
                  <div className="bg-[#0B0D17] p-3 rounded-full h-fit shrink-0">
                      <Icon className="text-[#00FF88] w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              )})}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SOLUÇÕES INOVADORAS (GRID) ================= */}
      <section className="py-20 bg-[#0E111C] text-white text-center">
        <h2 className="text-4xl font-bold mb-12">Soluções Inovadoras Velox</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
          {[ 
            { icon: Home, title: "Energia Solar", desc: "Sistemas Fotovoltaicos para residências, empresas e agronegócio." },
            { icon: Car, title: "Mobilidade Elétrica", desc: "Instalação de Eletropostos e carregadores para veículos elétricos." },
            { icon: Battery, title: "Armazenamento", desc: "Baterias inteligentes para garantir energia 24h e backup." },
            { icon: TrendingUp, title: "Mercado Livre", desc: "Compre energia mais barata diretamente no Mercado Livre." },
            { icon: Building2, title: "Para Condomínios", desc: "Energia compartilhada e redução de custos nas áreas comuns." },
            { icon: Leaf, title: "Crédito de Carbono", desc: "Sustentabilidade que gera receita para sua empresa." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                className="bg-[#141826] p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-800 hover:border-[#00FF88] transition flex flex-col"
                initial={{opacity:0, y:50}}
                whileInView={{opacity:1, y:0}}
                viewport={{ once: true }}
                transition={{delay:i*0.1, type:"spring", stiffness:100}}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="w-10 h-10 text-[#00FF88] mx-auto mb-3"/>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-12">
          <button 
            onClick={() => handleClickWhatsApp("Botão Seção Serviços")}
            className="inline-block bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl hover:bg-yellow-400 transition animate-pulse"
          >
            Fale com a Velox Solar
          </button>
        </div>
      </section>

      {/* ================= NÚMEROS ANIMADOS ================= */}
      <section ref={statsRef} className="py-20 bg-[#0B0D17] text-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 px-6">
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

      {/* ================= QUEM SOMOS ================= */}
      <section className="py-20 bg-[#0E111C] text-white text-center">
        <h2 className="text-5xl font-bold mb-12">Quem Somos</h2>
        <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="relative w-80 h-80"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/cards-solar.webp"
                alt="Projetos solares"
                fill
                className="object-cover rounded-2xl"
              />
            </motion.div>
            <div className="text-lg md:text-xl leading-relaxed space-y-4 max-w-md text-left">
              <p><strong>Mais de 10.000 projetos instalados</strong> em todo o país, oferecendo soluções de alta qualidade e eficiência.</p>
              <p><strong>Referência no mercado</strong> de energia solar, com reconhecimento por clientes e parceiros.</p>
              <p><strong>Confiança garantida</strong>, cada projeto é executado com cuidado, segurança e compromisso com resultados.</p>
              <div className="mt-6">
                <button
                  onClick={() => handleClickWhatsApp("Botão Quem Somos")}
                  className="bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-xl hover:bg-yellow-400 transition"
                >
                  Fale com a Velox Solar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-20 bg-[#0B0D17] text-white text-center">
        <h2 className="text-4xl font-bold mb-10">Perguntas Frequentes</h2>
        <div className="max-w-4xl mx-auto text-left space-y-4 px-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-[#141826] rounded-2xl p-4 cursor-pointer"
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
            onClick={() => handleClickWhatsApp("Botão FAQ")}
            className="inline-block bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl hover:bg-yellow-400 transition animate-pulse"
          >
            Fale com a Velox Solar
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-gray-400 flex flex-col items-center gap-3 bg-[#0E111C]">
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