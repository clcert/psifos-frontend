function InfoVotacion(props) {
  const data = require("../../../static/dummyData/eleccionesCursoData.json");
  return (
    <div>
      <section className="section" id="eleccion">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="election-box">
                <div className="election-box-info">
                  <div className="is-flex ml-0">
                    <img width={40} height={40} src={props.image} />

                    <p className="has-text-weight-bold is-size-4 ml-3 mt-4 current-election-title ">
                      {data.type + " EN CURSO"}
                    </p>
                  </div>

                  <div className="ml-5 mb-3">
                    <p className="has-text-weight-bold is-size-5 mb-0">
                      {data.now.type + ":"}
                    </p>
                    <p className=" is-size-5 mb-0">{data.now.name}</p>
                  </div>

                  <div className="ml-5 mb-3">
                    <p className="has-text-weight-bold is-size-5 mb-0">FECHA</p>
                    <p className=" is-size-5 mb-0">{data.now.time}</p>
                  </div>
                  <div className="mb-3 m-auto">
                    <button className="ml-5 button is-danger">
                      {props.nameButton}
                    </button>
                  </div>
                  <div className="ml-5 mb-3 current-election-close">
                    <p className="has-text-weight-bold is-size-5 mb-0">
                      {data.close.type + " CERRADA"}:
                    </p>
                    <p>{data.close.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InfoVotacion;
