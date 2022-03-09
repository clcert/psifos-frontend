function PercentageBar(props) {
  return (
    <progress
      className="progress is-info"
      value={props.percentage}
      max="100"
    ></progress>
  );
}

export default PercentageBar;
