import { Image } from "react-bootstrap";

function ImageFooter(props) {
  return (
    <section
      className="section pb-0 is-flex is-justify-content-center is-align-content-flex-end"
      id="drawing-section"
    >
      <figure className="image">
        <Image id="send-final-img" src={props.imagePath} />
      </figure>
    </section>
  );
}

export default ImageFooter;
