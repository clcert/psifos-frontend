function CardInstruction({title, description}) {
    return (
        <div className="box ">
            <div className="is-size-4">{title}</div>
            <hr />
            {description}
        </div>
    )
  }

export default CardInstruction;