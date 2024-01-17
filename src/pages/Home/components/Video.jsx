function Video(props) {
  return (
    <div>
      <section className="section video-section" id="video">
        <div className="container">
          <h1 className="title pt-2" id="election-current">
            {props.title}
          </h1>
          <h1 className="subtitle" id="election-current">
            {props.info}
          </h1>
          <figure className="image is-16by9">
            <iframe
              title="Video"
              className="has-ratio"
              width="640"
              height="360"
              src={props.video}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </figure>
        </div>
      </section>
    </div>
  );
}

export default Video;
