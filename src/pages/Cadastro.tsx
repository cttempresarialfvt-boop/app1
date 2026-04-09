import { useState, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Mail, User, Phone, Car, Image as ImageIcon, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Cadastro() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [files, setFiles] = useState<{ frente: File | null; verso: File | null }>({
    frente: null,
    verso: null,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    files: "",
  });

  const fileInputFrente = useRef<HTMLInputElement>(null);
  const fileInputVerso = useRef<HTMLInputElement>(null);

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

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const validateStep2 = () => {
    const newErrors = { name: "", email: "", phone: "", cpf: "", files: "" };
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
      newErrors.phone = "Telefone inválido.";
      isValid = false;
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      newErrors.cpf = "CPF inválido (11 dígitos).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const getClientIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'Desconhecido';
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFinalSubmit = async () => {
    if (!files.frente || !files.verso) {
      setErrors({ ...errors, files: "Por favor, anexe a frente e o verso do documento." });
      return;
    }
    setErrors({ ...errors, files: "" });
    setLoading(true);

    try {
      // Upload Images
      const urlFrente = await uploadFile(files.frente, 'frente');
      const urlVerso = await uploadFile(files.verso, 'verso');

      // Coleta Info
      const ip = await getClientIP();
      const userAgent = navigator.userAgent;

      // Inserir Banco
      const { error } = await supabase.from('clientes').insert([
        {
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          cpf: formData.cpf,
          ip: ip,
          tipo_dispositivo: userAgent,
          rg_frente_url: urlFrente,
          rg_verso_url: urlVerso
        }
      ]);

      if (error) throw error;
      setStep(4);
    } catch (err: any) {
      alert("Erro ao enviar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logoUrl = "https://cdn.dealerspace.ai/barigui/seminovos/logos/logo-barigui-seminovos.webp";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans py-12">
      <div className="w-full max-w-lg">
        {/* Header / Logo */}
        <div className="mb-8 flex justify-center">
          <img src={logoUrl} alt="Barigui Seminovos" className="h-16 object-contain" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Bem-vindo à Barigui Seminovos</h1>
                <p className="text-gray-500 text-lg">Cadastro simplificado com envio seguro de documentos.</p>
              </div>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img 
                  src="https://dealersites-content.s3.amazonaws.com/barigui/rodrigo/chave%20na%20m%C3%A3o1920%20x%20500.webp" 
                  alt="Chave na Mão" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end p-6">
                  <h2 className="text-white text-2xl font-bold drop-shadow-md">Aprovação 100% Online</h2>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-14 text-lg bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-lg transition-all active:scale-95">
                Iniciar Cadastro Especial
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
            >
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-blue-800 text-white p-8">
                  <CardTitle className="text-2xl font-bold">Seus Dados Principais</CardTitle>
                  <CardDescription className="text-blue-100">Etapa 1 de 2: Informações de contato.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="Ex: João Silva" 
                        className={`pl-10 h-12 rounded-xl focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                        value={formData.name}
                        onChange={e => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: ""}); }}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">CPF</Label>
                    <Input 
                      placeholder="000.000.000-00" 
                      className={`h-12 rounded-xl focus:ring-blue-500 ${errors.cpf ? 'border-red-500' : ''}`}
                      value={formData.cpf}
                      onChange={e => { setFormData({...formData, cpf: formatCPF(e.target.value)}); setErrors({...errors, cpf: ""}); }}
                    />
                    {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="(00) 00000-0000" 
                          className={`pl-9 h-12 rounded-xl focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                          value={formData.phone}
                          onChange={e => { setFormData({...formData, phone: formatPhone(e.target.value)}); setErrors({...errors, phone: ""}); }}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="email" 
                          placeholder="seu@email.com" 
                          className={`pl-9 h-12 rounded-xl focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                          value={formData.email}
                          onChange={e => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: ""}); }}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button onClick={prevStep} variant="outline" className="flex-1 h-12 rounded-xl border-gray-200">Voltar</Button>
                    <Button onClick={nextStep} className="flex-[2] h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md">
                      Avançar <ChevronRight className="ml-2 w-4 h-4"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-blue-700 text-white p-8">
                  <CardTitle className="text-2xl font-bold">Documentação</CardTitle>
                  <CardDescription className="text-blue-100">Etapa 2 de 2: Foto da Identidade ou CNH.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm">
                    Tire fotos legíveis, sem reflexos, do seu documento original fora do plástico.
                  </div>

                  <div className="space-y-4">
                    {/* Frente */}
                    <div 
                      className={`border-2 border-dashed ${files.frente ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'} rounded-2xl p-6 text-center cursor-pointer transition-colors`}
                      onClick={() => fileInputFrente.current?.click()}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputFrente}
                        onChange={e => setFiles({...files, frente: e.target.files?.[0] || null})}
                      />
                      {files.frente ? (
                        <div className="flex flex-col items-center text-green-700">
                          <CheckCircle2 className="w-8 h-8 mb-2" />
                          <span className="font-semibold">{files.frente.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <UploadCloud className="w-8 h-8 mb-2 text-blue-500" />
                          <span className="font-semibold text-gray-700">Frente do Documento</span>
                          <span className="text-xs mt-1">Toque para selecionar imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Verso */}
                    <div 
                      className={`border-2 border-dashed ${files.verso ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'} rounded-2xl p-6 text-center cursor-pointer transition-colors`}
                      onClick={() => fileInputVerso.current?.click()}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputVerso}
                        onChange={e => setFiles({...files, verso: e.target.files?.[0] || null})}
                      />
                      {files.verso ? (
                        <div className="flex flex-col items-center text-green-700">
                          <CheckCircle2 className="w-8 h-8 mb-2" />
                          <span className="font-semibold">{files.verso.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <ImageIcon className="w-8 h-8 mb-2 text-blue-500" />
                          <span className="font-semibold text-gray-700">Verso do Documento</span>
                          <span className="text-xs mt-1">Toque para selecionar imagem</span>
                        </div>
                      )}
                    </div>
                    {errors.files && <p className="text-sm font-semibold text-center text-red-500">{errors.files}</p>}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button onClick={prevStep} variant="outline" className="flex-1 h-12 rounded-xl" disabled={loading}>Voltar</Button>
                    <Button onClick={handleFinalSubmit} className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md" disabled={loading}>
                      {loading ? 'Enviando e Salvando...' : 'Finalizar Cadastro'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 bg-white p-10 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-100 p-6 rounded-full">
                  <CheckCircle2 className="h-20 w-20 text-green-600" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-blue-900">Cadastro Concluído!</h2>
                <p className="text-gray-600">Seus dados e documentos foram enviados com segurança. Nossa equipe administrativa analisará e entrará em contato.</p>
              </div>

              <Button onClick={() => window.location.reload()} variant="outline" className="text-blue-700 font-semibold rounded-xl h-12 px-8">
                Voltar à Página Inicial
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
