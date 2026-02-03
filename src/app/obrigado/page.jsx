"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Obrigado() {
  const [count, setCount] = useState(3);
  const defaultUrl = "https://wa.me/5511951569352"; 

  useEffect(() => {
    // Tenta pegar o link salvo, se não tiver, usa o padrão
    const redirectUrl = localStorage.getItem("velox_redirect") || defaultUrl;

    // Dispara Pixel de Lead
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq('track', 'Lead'); 
      window.fbq('track', 'CompleteRegistration');
    }

    // Contagem
    const timer = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Redireciona
    const redirect = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, []);

  const handleManualClick = () => {
     const url = localStorage.getItem("velox_redirect") || defaultUrl;
     window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#0B0D17] flex flex-col items-center justify-center text-center px-6 font-sans text-white selection:bg-[#00FF88] selection:text-black">
      
      <div className="bg-[#141826] p-8 rounded-3xl border border-[#00FF88]/30 shadow-[0_0_40px_rgba(0,255,136,0.1)] max-w-md w-full">
        <div className="mx-auto bg-[#00FF88]/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-[#00FF88]">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl font-bold mb-2">Tudo certo! 🚀</h1>
        <p className="text-gray-400 mb-8">
          Recebemos suas respostas. Você será redirecionado para o WhatsApp de um especialista...
        </p>

        <div className="flex items-center justify-center gap-2 text-[#00FF88] font-bold text-lg mb-8 animate-pulse">
          <FaWhatsapp size={24} />
          Redirecionando em {count}...
        </div>

        <div className="flex justify-center mb-6">
            <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
        </div>

        <button 
          onClick={handleManualClick}
          className="text-sm text-gray-500 underline hover:text-white transition cursor-pointer"
        >
          Não foi redirecionado? Clique aqui.
        </button>
      </div>
    </div>
  );
}