import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin"
import SubNavbar from "../component/SubNavbar"
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos"
import FooterParticipa from "../../../component/Footers/FooterParticipa"

export default function ViewQuestionsMainInterface({ children }) {
    return (
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <TitlePsifos namePage="Creación de Preguntas" />
          </div>
        </section>
  
        <SubNavbar active={1} />
  
        <section
          className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
          id="create-question-section"
        >
        {children}
        </section>
        <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
      </div>
    )
}