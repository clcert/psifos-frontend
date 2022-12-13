import InfoVotacion from "./components/InfoVotacion";
import VotacionesRealizadas from "./components/VotacionesRealizadas";
import PreguntasFrecuentes from "./components/PreguntasFrecuentes";
import TeamComponent from "./components/TeamComponent";
import Video from "./components/Video";
import FooterParticipa from "../../component/Footers/FooterParticipa";
import sobre from "../../static/new_home_assets/SVG/sobre.svg";
import "../../static/assets_home/css/Home.css";
import UpperBanner from "../../component/Banner/UpperBanner";


function Home() {

  const elections = require("../../static/data/currentElections.json");
  
  return (
    <div id="content">
      <UpperBanner title="BIENVENIDO" subtitle="AL SISTEMA DE VOTACIÓN" />
      <section className="election-section pt-0 pb-0">
        <div className="election-sect">
          <div
            className="current-elections-section is-centered m-auto"
            id="curso"
          >
            {
              elections.data.map((election, index) => (
                <InfoVotacion image={sobre} electionData={election} key={index} />
              ))
            }
          </div>

          <Video
            title="¿CÓMO VOTAR UTILIZANDO PARTICIPA UCHILE?"
            info="Revisa el vídeo a continuación para aprender a votar utilizando
            Participa UChile"
            video="https://www.youtube.com//embed/9sVCptKbr48"
          />
        </div>
      </section>
      <section className="section faq-section pt-4" id="faq">
        <div>
          <div className="container ">
            <h1 className="title pt-2" id="election-current">
              PREGUNTAS FRECUENTES (FAQ)
            </h1>
            <PreguntasFrecuentes
              pregunta="1. ¿Cómo se autentican los usuarios?"
              respuesta="Todos los votantes de Participa UChile deben contar con una cuenta
              UChile (cuenta Pasaporte o mi.uchile) puesto que es la única
              manera de autenticarse en el sistema."
            />

            <PreguntasFrecuentes
              pregunta="2. ¿En qué elecciones se utiliza el sistema Participa UChile?"
              respuesta={
                <div>
                  Participa UChile está orientado a elecciones de{" "}
                  <span className="has-text-weight-bold">
                    bajo perfil en un contexto universitario
                  </span>
                  , como por ejemplo, elecciones de directores de unidades
                  académicas, consejeros, representantes de funcionarios y
                  elecciones estudiantiles locales. Cuando la elección es de
                  alto perfil, como por ejemplo, elecciones de cargos públicos
                  de nivel nacional (presidente y representantes, etc.), la
                  votación electrónica remota es aún un desafío con muchas
                  interrogantes y riesgos significativos. La{" "}
                  <a
                    href="https://www.nationalacademies.org/our-work/the-future-of-voting-accessible-reliable-verifiable-technology"
                    rel="noreferrer"
                    target="_blank"
                  >
                    recomendación de la comunidad experta internacional
                  </a>{" "}
                  para dicho contexto es no utilizar votación remota pues no se
                  conoce un sistema hoy en día que garantice seguridad a un
                  nivel adecuado. Participa UChile no es la excepción.
                </div>
              }
            />

            <PreguntasFrecuentes
              pregunta="3. ¿Qué seguridad provee Participa UChile?"
              respuesta={
                <div>
                  Participa UChile es una adaptación del sistema{" "}
                  <a
                    href="https://www.usenix.org/legacy/event/sec08/tech/full_papers/adida/adida.pdf"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Helios Voting, propuesto por Ben Adida (2008)
                  </a>
                  . Helios ha sido utilizado por entidades como la International
                  Association for Cryptographic Research, y la U. de Louvain-Le
                  Neuve (Bélgica). Participa UChile, tal como Helios, utiliza{" "}
                  <span className="has-text-weight-bold">
                    algoritmos matemáticos para mejorar la seguridad del sistema
                  </span>
                  . El sistema permite, por ejemplo, garantizar el secreto del
                  voto encriptando los votos con una clave secreta dividida
                  entre varios custodios. De hecho, el sistema nunca revela
                  (desencripta) algún voto individual sino sólo el resultado
                  final, para lo cual se requiere la cooperación activa de los
                  custodios. Adicionalmente, cualquier persona, sea un
                  participante en la elección o un mero observador pasivo, puede
                  auditar la elección, esto es, verificar matemáticamente que el
                  resultado es consistente con los votos encriptados emitidos.
                </div>
              }
            />

            <PreguntasFrecuentes
              pregunta="4. ¿En qué se diferencia Participa UChile de un sistema de
            votación cerrado?"
              respuesta={
                <div>
                  Los algoritmos criptográficos del sistema Participa UChile
                  permiten evidenciar intentos externos o internos de
                  manipulación de votos o del total. Otros sistemas cerrados son
                  opacos y sólo entregan el resultado sin mayor explicación. En
                  ellos, tanto el secreto de un voto individual como la
                  integridad del resultado final depende exclusivamente del
                  administrador del sistema informático. Los votantes y la
                  comunidad deben depositar su confianza en el accionar correcto
                  del administrador, sin posibilidad de confirmar si la
                  confianza es merecida o no. Si bien Participa UChile no
                  elimina completamente dicha confianza, la minimiza
                  significativamente, dándole herramientas al votante para
                  confirmar si es merecida o no.
                </div>
              }
            />

            <PreguntasFrecuentes
              pregunta="5. ¿Cómo puedo verificar que mi voto ha sido recibido por
            Participa UChile?"
              respuesta={
                <div>
                  Cada votante, al concluir la selección de sus preferencias y
                  enviar la papeleta con su voto encriptado, recibe un código
                  serial identificador de la papeleta. Este código no revela su
                  voto ni permite revelarlo a un tercero, pero sí permite
                  identificar la papeleta encriptada dentro de la lista de
                  papeletas encriptadas recibidas por el servidor.
                </div>
              }
            />

            <PreguntasFrecuentes
              pregunta="6. ¡El sistema permite votar más de una vez! ¿Es un error o
            falla?"
              respuesta={
                <div>
                  El sistema permite que, cualquier votante, luego de haber
                  votado pueda ingresar nuevamente y reiniciar el proceso de
                  votación, emitiendo un nuevo voto que reemplaza al voto
                  anterior. El sistema nunca almacena más de un voto por
                  votante. Si bien para un votante puede parecer que emite un
                  "segundo voto", eso no es efectivo, pues efectivamente está
                  reemplazando su voto. En particular, no puede darse el caso
                  que un mismo votante tenga dos votos o más, siempre tendrá a
                  lo más un voto. Esta funcionalidad es intencional y, si bien
                  no existe en un sistema de votación de “lápiz y papel”, es
                  posible de implementar de forma segura en un sistema
                  electrónico. Es una medida estándar de mitigación parcial
                  contra el problema de la coerción. Si bien no es perfecta, es
                  simple de implementar y en entornos de baja coerción se
                  considera razonablemente efectiva. Para la tranquilidad de
                  todas y todos, podemos aclarar que no es una característica
                  errónea o en necesidad de arreglo, pues no viola la unicidad
                  del voto.
                </div>
              }
            />
          </div>
        </div>
      </section>
      <section className="section team-section" id="equipo">
        <div className="container">
          <h1 className="title pt-2" id="election-current">
            EQUIPO DE TRABAJO
          </h1>
          <div className="columns">
            <div className="column">
              <TeamComponent
                name="ALEJANDRO HEVIA"
                rol="Coordinador Académico"
                image={process.env.PUBLIC_URL + "/Fotos/alejandro2.png"}
              />
            </div>
            <div className="column">
              <TeamComponent
                name="CAMILO GÓMEZ"
                rol="Coordinador Operativo"
                image={process.env.PUBLIC_URL + "/Fotos/camilo2.png"}
              />
            </div>
            <div className="column is-one-third">
              <TeamComponent
                name="CATALINA BURGOS"
                rol="Diseñadora Gráfica"
                image={process.env.PUBLIC_URL + "/Fotos/catalina2.png"}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-one-third">
              <TeamComponent
                name="EDUARDO RIVEROS"
                rol="Ingeniero de Ciberseguridad e Infraestructura"
                image={process.env.PUBLIC_URL + "/Fotos/eduardo2.png"}
              />
            </div>
            <div className="column is-one-third">
              <TeamComponent
                name="MARÍA GRAZIA PRATO"
                rol="Diseñadora UI/UX"
                image={process.env.PUBLIC_URL + "/Fotos/grazzia2.png"}
              />
            </div>

            <div className="column is-one-third">
              <TeamComponent
                name="RICARDO PERALTA"
                rol="Ingeniero de Desarrollo"
                image={process.env.PUBLIC_URL + "/Fotos/matias2.png"}
              />
            </div>
          </div>

          <div className="is-flex is-justify-content-center">
            <span className="bullet-1">•</span> &emsp;{" "}
            <span className="bullet-2">•</span> &emsp;{" "}
            <span className="bullet-3">•</span> &emsp;{" "}
            <span className="bullet-4">•</span>
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      <section className="hero">
        <div className="hero-body bottom-hero"></div>
      </section>
    </div>
  );
}

export default Home;
