import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Linkora",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Política de Privacidade</h1>
        </div>
        <p className="mb-8 text-sm text-zinc-500">Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>

        <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-zinc-600 prose-li:text-[15px] prose-li:text-zinc-600">
          <h2>1. Informações que Coletamos</h2>
          <p>A Linkora, operada pela Azecom Internet LTDA (CNPJ: 15.209.484/0001-50), coleta as seguintes informações:</p>
          <ul>
            <li><strong>Dados de cadastro:</strong> nome, email, senha (criptografada)</li>
            <li><strong>Dados de perfil:</strong> username, bio, avatar, redes sociais</li>
            <li><strong>Dados de uso:</strong> páginas acessadas, interações com a plataforma</li>
            <li><strong>Dados de pagamento:</strong> processados exclusivamente pelo Stripe, não armazenamos dados de cartão</li>
          </ul>

          <h2>2. Como Usamos seus Dados</h2>
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>Fornecer e manter o serviço da plataforma</li>
            <li>Processar pagamentos e transações</li>
            <li>Enviar comunicações relacionadas ao serviço</li>
            <li>Melhorar a experiência do usuário</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>

          <h2>3. Compartilhamento de Dados</h2>
          <p>Não vendemos seus dados pessoais. Compartilhamos dados apenas com:</p>
          <ul>
            <li><strong>Stripe:</strong> para processamento de pagamentos</li>
            <li><strong>Supabase:</strong> para armazenamento seguro de dados</li>
            <li><strong>Vercel:</strong> para hospedagem da plataforma</li>
            <li><strong>Autoridades legais:</strong> quando exigido por lei</li>
          </ul>

          <h2>4. Segurança dos Dados</h2>
          <p>Implementamos medidas de segurança incluindo criptografia de dados em trânsito (HTTPS/TLS), Row Level Security no banco de dados, autenticação segura e backups regulares.</p>

          <h2>5. Seus Direitos (LGPD)</h2>
          <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Revogar consentimento a qualquer momento</li>
            <li>Solicitar portabilidade dos dados</li>
            <li>Ser informado sobre compartilhamento de dados</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>Utilizamos cookies essenciais para funcionamento da autenticação e sessão. Consulte nossa <Link href="/cookies" className="text-violet-600">Política de Cookies</Link> para mais detalhes.</p>

          <h2>7. Retenção de Dados</h2>
          <p>Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, seus dados são removidos em até 30 dias, exceto quando a retenção for exigida por lei.</p>

          <h2>8. Menores de Idade</h2>
          <p>A Linkora não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores.</p>

          <h2>9. Alterações nesta Política</h2>
          <p>Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email.</p>

          <h2>10. Contato do Encarregado de Dados (DPO)</h2>
          <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato: <a href="mailto:Support@liinkoraa.com" className="text-violet-600">Support@liinkoraa.com</a></p>
        </div>
      </div>
    </div>
  );
}
