function InfoVotacion() {
  return (
    <div>
      <section className="section election-section" id="eleccion">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="election-box">
                <div className="election-box-info">
                  <p className="election-info mb-2 mx-2">
                    <span className="has-text-weight-bold current-election-title">
                      ELECCIÓN EN CURSO
                    </span>
                  </p>

                  <div className="election-info mx-2 pt-3">
                    <p className="has-text-weight-bold has-text-centered pb-2">
                      NINGUNA ELECCIÓN EN CURSO
                    </p>
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
