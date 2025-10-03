import { Link } from "react-router-dom";
import HeroImage from "../assets/fitness-hero.png";
//import Feature1 from "../assets/feature1.png";
//import Feature2 from "../assets/feature2.png";
//import Feature3 from "../assets/feature3.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
    return (

        <div>
            <Navbar />
            <div className="home">

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-text">
                        <h1>Transforme seu treino com Kryon</h1>
                        <p>Monitore seus progressos, treinos e dietas em um único lugar.</p>
                        <Link to="/signup" className="cta-btn">Comece Agora</Link>
                    </div>
                    <div className="hero-image">
                        <img src={HeroImage} alt="Fitness" />
                    </div>
                </section>

                {/* Motivational Section */}
                <section className="motivation">
                    <h2>Motivação diária</h2>
                    <p>Não espere pelo momento perfeito. Transforme cada treino em progresso!</p>
                </section>

                {/* Features Section */}
                <section className="features">
                    <h2>Funcionalidades</h2>
                    <div className="feature-cards">
                        <div className="card">
                            <img src="{Feature1}" alt="Treinos Personalizados" />
                            <h3>Treinos Personalizados</h3>
                            <p>Crie treinos adaptados ao seu nível e objetivos.</p>
                        </div>
                        <div className="card">
                            <img src="{Feature2}" alt="Dietas Planejadas" />
                            <h3>Dietas Planejadas</h3>
                            <p>Receba planos alimentares para complementar seu treino.</p>
                        </div>
                        <div className="card">
                            <img src="{Feature3}" alt="Monitoramento de Progresso" />
                            <h3>Monitoramento de Progresso</h3>
                            <p>Visualize gráficos e estatísticas do seu desempenho.</p>
                        </div>
                    </div>
                </section>



                <style>
                    {`
          .home {
            font-family: 'Arial', sans-serif;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .hero {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 50px;
            gap: 20px;
          }

          .hero-text {
            flex: 1;
            min-width: 250px;
          }

          .hero-text h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
          }

          .hero-text p {
            font-size: 1.2rem;
            margin-bottom: 20px;
          }

          .cta-btn {
            padding: 10px 20px;
            background-color: #ff7f50;
            color: white;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: background 0.3s;
          }

          .cta-btn:hover {
            background-color: #ff946b;
          }

          .hero-image img {
            width: 400px;
            max-width: 100%;
            border-radius: 10px;
          }

          .features {
            text-align: center;
            margin-bottom: 50px;
          }

          .features h2 {
            font-size: 2rem;
            margin-bottom: 30px;
          }

          .feature-cards {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }

          .card {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
            width: 250px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
          }

          .card:hover {
            transform: translateY(-5px);
          }

          .card img {
            width: 80px;
            margin-bottom: 15px;
          }

          .card h3 {
            margin-bottom: 10px;
          }

          .motivation {
            background-color: #282c34;
            color: white;
            text-align: center;
            padding: 40px 20px;
            border-radius: 10px;
            margin-bottom: 90px;
          }

          .motivation h2 {
            font-size: 2rem;
            margin-bottom: 20px;
          }

          /* Responsivo */
          @media (max-width: 768px) {
            .hero {
              flex-direction: column;
              text-align: center;
            }
          }
        `}
                </style>
            </div>
            <Footer />
        </div>

    );
}

export default Home;
