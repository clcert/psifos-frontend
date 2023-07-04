import FooterParticipa from "../../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../../component/ShortNavBar/MyNavbar";

function Header({
  linkExit, linkInit, electionName, title,
}) {
    return (
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={linkExit}
            linkInit={linkInit}
          />
          <TitlePsifos
            namePage={title}
            nameElection={electionName}
          />
        </div>
      </section>
    )
}

function Body({children}){
    return (
      <section className="section mb-5" id="drawing-section">
        <div className="container has-text-centered is-max-desktop">
          {children}
        </div>
      </section>
    )
}

export function CustodioCanva({
    linkExit, linkInit, electionName, children, title="Portal de Custodio de Clave",
}) {
    return (
        <div id="content-trustees">
        <Header
            linkExit={linkExit}
            linkInit={linkInit}
            electionName={electionName}
            title={title}
        />
        <Body>
            {children}
        </Body>
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />        
      </div>
    )
}
