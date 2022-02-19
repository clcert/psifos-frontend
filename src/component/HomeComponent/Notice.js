import $ from "jquery";

function Notice(props) {
  return (
    <>
        <div className="card">
          <div className="card-content">
            <div className="title-notice-box pt-1 pb-2">
              <p>{props.date}</p>
              <p>{props.title}</p>
            </div>
            <img
              width={1000}
              height={100}
              src={process.env.PUBLIC_URL + props.image}
            ></img>

            <div className="p-5 text-notice-box">
              <p>{props.shortInfo}</p>
              <div className="pt-4 more-notice-box">
                <a
                  onClick={() => {
                    $("#info-notice" + String(props.index)).addClass(
                      "is-active"
                    );
                  }}
                >
                  {" "}
                  LEER MÁS
                </a>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
export default Notice;
