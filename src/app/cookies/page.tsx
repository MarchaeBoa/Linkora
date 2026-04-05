import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Política de Cookies | Linkora",
};

export default function CookiesPage() {
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
          <h1 className="text-3xl font-extrabold text-zinc-900">Política de Cookies</h1>
        </div>
        <p className="mb-8 text-sm text-zinc-500">Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>

        <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-zinc-600 prose-li:text-[15px] prose-li:text-zinc-600">
          <h2>1. O que são Cookies?</h2>
          <p>Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site lembre suas preferências e mantenha sua sessão ativa.</p>

          <h2>2. Cookies que Utilizamos</h2>

          <h3 className="text-lg font-bold mt-6">Cookies Essenciais</h3>
          <p>Necessários para o funcionamento da plataforma. Não podem ser desativados.</p>
          <ul>
            <li><strong>Autenticação:</strong> mantém sua sessão de login ativa (Supabase Auth)</li>
            <li><strong>Segurança:</strong> proteção contra ataques CSRF</li>
            <li><strong>Preferências:</strong> idioma e configurações básicas</li>
          </ul>

          <h3 className="text-lg font-bold mt-6">Cookies de Desempenho</h3>
          <p>Nos ajudam a entender como os visitantes interagem com a plataforma.</p>
          <ul>
            <li><strong>Analytics:</strong> dados anônimos de navegação para melhoria do serviço</li>
          </ul>

          <h3 className="text-lg font-bold mt-6">Cookies de Terceiros</h3>
          <p>Serviços integrados que podem definir seus próprios cookies:</p>
          <ul>
            <li><strong>Stripe:</strong> cookies de segurança para processamento de pagamentos</li>
            <li><strong>Vercel:</strong> cookies de performance e analytics</li>
          </ul>

          <h2>3. Gerenciando Cookies</h2>
          <p>Você pode controlar e deletar cookies através das configurações do seu navegador. Note que desativar cookies essenciais pode impedir o funcionamento correto da plataforma, especialmente o login e checkout.</p>

          <h2>4. Tempo de Armazenamento</h2>
          <ul>
            <li><strong>Cookies de sessão:</strong> expiram quando você fecha o navegador</li>
            <li><strong>Cookies persistentes:</strong> permanecem por até 30 dias para manter sua sessão ativa</li>
          </ul>

          <h2>5. Consentimento</h2>
          <p>Ao continuar usando a Linkora, você consente com o uso de cookies conforme descrito nesta política. Você pode retirar seu consentimento a qualquer momento limpando os cookies do navegador.</p>

          <h2>6. Contato</h2>
          <p>Para dúvidas sobre nossa política de cookies: <a href="mailto:Support@liinkoraa.com" className="text-violet-600">Support@liinkoraa.com</a></p>
        </div>
      </div>
    </div>
  );
}
