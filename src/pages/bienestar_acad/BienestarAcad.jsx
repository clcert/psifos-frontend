import React from "react";
import UpperBanner from "../../component/Banner/UpperBanner";
import FooterParticipa from "../../component/Footers/FooterParticipa";

function BienestarAcad() {
    return (
        <div id="content">
            <UpperBanner subtitle="ELECCIÓN CONSEJO ADMINISTRATIVO DE BIENESTAR DEL PERSONAL"/>
            <section className="section bienestar-section is-flex is-justify-content-center is-flex-direction-column" id="bienestar" style={{backgroundColor: "#efdae4"}}>

                <span className="has-text-centered pt-4 pb-0 is-align-self-center has-text-weight-bold current-election-title" style={{color: "#93004c"}}>
                    ESTAMENTO ACADÉMICOS(AS)
                </span>
                <span className="has-text-centered pt-0 pb-4 is-align-self-center has-text-weight-bold is-size-4">
                    Selecciona la unidad a la que perteneces para ingresar a votar
                </span>
                

                <ul className="is-align-self-center has-text-centered pl-0">
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Centro de Extensión Artística y Cultural "D. S. C."</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Arquitectura y Urbanismo</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Artes</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Agronómicas</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Físicas y Matemáticas</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Forestales y de la Conservación de la Naturaleza</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Químicas y Farmacéuticas</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Sociales</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias Veterinarias y Pecuarias</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Ciencias</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Comunicación e Imágen</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Derecho</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Economía y Negocios</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Filosofía y Humanidades</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Gobierno</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Medicina</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Facultad de Odontología</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Hospital Clínico</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Instituto de Estudios Internacionales</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Instituto de Nutrición y Tecnología de los Alimentos</button></a></li>
                    <li><a href="#" target="_blank"><button className="unit-button" disabled>Vicerrectoría de Asuntos Estudiantiles y Comunitarios</button></a></li>
                </ul>
            </section>
            <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
            <section className="hero">
                <div className="hero-body bottom-hero py-4"></div>
            </section>
        </div>
    )
}

export default BienestarAcad
