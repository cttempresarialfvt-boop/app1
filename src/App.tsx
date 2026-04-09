/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Mail, User, Phone, Car } from "lucide-react";

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
    return value;
  };

  const validate = () => {
    const newErrors = { name: "", email: "", phone: "" };
    let isValid = true;

    if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Por favor, insira seu nome completo.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "E-mail inválido.";
      isValid = false;
    }

    const phoneNumbers = formData.phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      newErrors.phone = "Telefone inválido (mínimo 10 dígitos).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  const logoUrl = "https://cdn.dealerspace.ai/barigui/seminovos/logos/logo-barigui-seminovos.webp";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src={logoUrl} 
            alt="Barigui Seminovos" 
            className="h-16 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
                  Bem-vindo à Barigui Seminovos
                </h1>
                <p className="text-gray-500 text-lg">
                  Encontre o carro dos seus sonhos com as melhores condições do mercado.
                </p>
              </div>
              
              <div className="relative aspect-[1920/500] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img 
                  src="https://dealersites-content.s3.amazonaws.com/barigui/rodrigo/chave%20na%20m%C3%A3o1920%20x%20500.webp" 
                  alt="Chave na Mão Barigui" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>

              <Button 
                onClick={nextStep} 
                className="w-full h-14 text-lg bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-lg transition-all active:scale-95"
              >
                Ver Promoções Exclusivas
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-blue-700 text-white p-8">
                  <CardTitle className="text-2xl font-bold">Quase lá!</CardTitle>
                  <CardDescription className="text-blue-100 text-base">
                    Preencha seus dados para receber ofertas personalizadas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          id="name" 
                          placeholder="Ex: João Silva" 
                          className={`pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (errors.name) setErrors({...errors, name: ""});
                          }}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          className={`pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (errors.email) setErrors({...errors, email: ""});
                          }}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="(00) 00000-0000" 
                          className={`pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({...formData, phone: formatPhone(e.target.value)});
                            if (errors.phone) setErrors({...errors, phone: ""});
                          }}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600"
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-[2] h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md"
                      >
                        Cadastrar Agora
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="text-center space-y-8 py-8"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="bg-green-100 p-6 rounded-full"
                  >
                    <CheckCircle2 className="h-20 w-20 text-green-600" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 bg-green-400 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-blue-900">Cadastro Realizado!</h2>
                <p className="text-gray-600 text-lg max-w-xs mx-auto">
                  Parabéns, <span className="font-bold text-blue-700">{formData.name.split(' ')[0]}</span>! 
                  Você receberá nossas melhores promoções diretamente no seu canal de comunicação.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 text-left">
                <div className="bg-blue-700 p-3 rounded-xl text-white">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">Consultor Barigui</p>
                  <p className="text-xs text-blue-700">Entraremos em contato em breve.</p>
                </div>
              </div>

              <Button 
                onClick={() => setStep(1)} 
                variant="ghost" 
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-semibold"
              >
                Voltar ao Início
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            Barigui Seminovos © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
