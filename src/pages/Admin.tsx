import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        loadClientes();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) loadClientes();
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const loadClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar clientes:', error);
    } else {
      setClientes(data || []);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-sm rounded-3xl border-none shadow-xl">
          <CardHeader className="bg-blue-900 text-white p-8 rounded-t-3xl">
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription className="text-blue-200">Painel Administrativo Barigui</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">E-mail</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Senha</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="rounded-xl h-12"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-blue-700 hover:bg-blue-800">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Clientes</h1>
          <Button onClick={() => supabase.auth.signOut()} variant="outline" className="rounded-xl">Sair</Button>
        </div>

        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-4 rounded-tl-3xl">Data</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">CPF</th>
                  <th className="p-4">Dispositivo/IP</th>
                  <th className="p-4 rounded-tr-3xl">Documentos</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{cliente.nome}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{cliente.email}</div>
                      <div>{cliente.telefone}</div>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-500">{cliente.cpf}</td>
                    <td className="p-4 text-xs text-gray-400">
                      <div>{cliente.ip}</div>
                      <div className="truncate w-32" title={cliente.tipo_dispositivo}>{cliente.tipo_dispositivo}</div>
                    </td>
                    <td className="p-4 flex gap-2">
                      {cliente.rg_frente_url && (
                        <a href={cliente.rg_frente_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                          Frente
                        </a>
                      )}
                      {cliente.rg_verso_url && (
                        <a href={cliente.rg_verso_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                          Verso
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Nenhum cliente cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
