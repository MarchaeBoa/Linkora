import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Linkora",
};

export default function TermosPage() {
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
          <h1 className="text-3xl font-extrabold text-zinc-900">Termos de Uso</h1>
        </div>
        <p className="mb-8 text-sm text-zinc-500">Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>

        <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-zinc-600 prose-li:text-[15px] prose-li:text-zinc-600">
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar a plataforma Linkora, operada pela Azecom Internet LTDA (CNPJ: 15.209.484/0001-50), você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.</p>

          <h2>2. Descrição do Serviço</h2>
          <p>A Linkora é uma plataforma SaaS que permite a criadores digitais criar páginas personalizadas (link na bio), vender produtos digitais, capturar leads e gerenciar seu negócio online.</p>

          <h2>3. Cadastro e Conta</h2>
          <p>Para utilizar os serviços, você deve criar uma conta fornecendo informações verdadeiras e completas. Você é responsável por manter a segurança da sua senha e por todas as atividades realizadas na sua conta.</p>

          <h2>4. Uso Aceitável</h2>
          <p>Você concorda em não utilizar a plataforma para:</p>
          <ul>
            <li>Atividades ilegais ou fraudulentas</li>
            <li>Distribuição de conteúdo que viole direitos autorais de terceiros</li>
            <li>Envio de spam ou comunicações não solicitadas</li>
            <li>Tentativa de comprometer a segurança da plataforma</li>
            <li>Venda de produtos proibidos por lei</li>
          </ul>

          <h2>5. Produtos Digitais</h2>
          <p>Ao vender produtos pela Linkora, você declara ser o proprietário ou ter os direitos de distribuição do conteúdo. A Linkora não se responsabiliza pelo conteúdo dos produtos vendidos pelos criadores.</p>

          <h2>6. Pagamentos</h2>
          <p>Os pagamentos são processados pelo Stripe. A Linkora não cobra taxa de plataforma sobre vendas nos planos aplicáveis. As taxas do processador de pagamento (Stripe) são de responsabilidade do vendedor.</p>

          <h2>7. Planos e Cancelamento</h2>
          <p>A Linkora oferece planos gratuitos e pagos. Você pode cancelar seu plano a qualquer momento. O cancelamento entra em vigor no final do período de cobrança vigente.</p>

          <h2>8. Propriedade Intelectual</h2>
          <p>A marca Linkora, logo, design e código-fonte são propriedade da Azecom Internet LTDA. O conteúdo criado pelos usuários permanece de propriedade dos respectivos criadores.</p>

          <h2>9. Limitação de Responsabilidade</h2>
          <p>A Linkora é fornecida "como está". Não garantimos que o serviço será ininterrupto ou livre de erros. Nossa responsabilidade é limitada ao valor pago pelo serviço nos últimos 12 meses.</p>

          <h2>10. Modificações</h2>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por email com 30 dias de antecedência.</p>

          <h2>11. Contato</h2>
          <p>Para dúvidas sobre estes termos, entre em contato: <a href="mailto:Support@liinkoraa.com" className="text-violet-600">Support@liinkoraa.com</a></p>

          <h2>12. Foro</h2>
          <p>Fica eleito o foro da comarca da sede da empresa para dirimir quaisquer controvérsias decorrentes destes Termos.</p>
        </div>
      </div>
    </div>
  );
}
