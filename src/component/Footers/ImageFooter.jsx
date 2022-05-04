
function ImageFooter(props) {
  return (
    <section
      className="section pb-0 is-flex is-justify-content-center is-align-content-flex-end"
      id="drawing-section"
    >
      <figure className="image">
        <img id="send-final-img" src={props.imagePath} alt=""/>
      </figure>
    </section>
  );
}

export default ImageFooter;
