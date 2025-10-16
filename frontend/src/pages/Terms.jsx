import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  return (
    <div>
      <Navbar />
      <div className="terms">
        <section className="terms-header">
          <h1>Termos de Uso</h1>
          <p>
            Bem-vindo ao Kryon! Ao utilizar nossa plataforma, você concorda com
            os termos e condições descritos abaixo.
          </p>
        </section>

        <section className="terms-content">
          <div className="term-section">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou usar o Kryon, você concorda em cumprir estes Termos
              de Uso e todas as leis e regulamentos aplicáveis. Caso não
              concorde, não utilize o serviço.
            </p>
          </div>

          <div className="term-section">
            <h2>2. Uso da Plataforma</h2>
            <p>
              O Kryon é destinado ao gerenciamento de treinos e
              progresso pessoal. Você se compromete a utilizar o serviço de
              forma ética, sem práticas fraudulentas, ofensivas ou que possam
              causar danos a terceiros.
            </p>
          </div>

          <div className="term-section">
            <h2>3. Conta de Usuário</h2>
            <p>
              Para acessar algumas funcionalidades, é necessário criar uma
              conta. Você é responsável por manter a confidencialidade das suas
              credenciais e por todas as atividades realizadas em sua conta.
            </p>
          </div>

          <div className="term-section">
            <h2>5. Modificações</h2>
            <p>
              O Kryon reserva-se o direito de alterar estes Termos a qualquer
              momento. Notificaremos sobre mudanças significativas através do
              site ou por e-mail.
            </p>
          </div>

          <div className="term-section">
            <h2>6. Contato</h2>
            <p>
              Caso tenha dúvidas sobre estes Termos, entre em contato conosco.
            </p>
          </div>
        </section>

        <style>
          {`
          .terms {
            font-family: 'Arial', sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
          }

          .terms-header {
            text-align: center;
            margin-bottom: 50px;
          }

          .terms-header h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #ff7f50;
          }

          .terms-header p {
            font-size: 1.1rem;
            color: #555;
          }

          .term-section {
            margin-bottom: 40px;
          }

          .term-section h2 {
            color: #ff7f50;
            font-size: 1.5rem;
            margin-bottom: 10px;
          }

          .term-section p {
            font-size: 1rem;
            color: #444;
          }

          a {
            color: #ff7f50;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .terms {
              padding: 20px;
            }

            .terms-header h1 {
              font-size: 2rem;
            }

            .term-section h2 {
              font-size: 1.3rem;
            }
          }
        `}
        </style>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;
