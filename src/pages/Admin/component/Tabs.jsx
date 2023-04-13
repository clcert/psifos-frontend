export default function Tabs(props) {
  return (
    <ul className="nav nav-tabs mb-4">
      {props.tabs.map((tab, index) => {
        return (
          <li className="nav-item" key={index}>
            <button
              type="button"
              className={"nav-link " + (props.actualTab === index ? "active" : "")}
              onClick={() => props.setActualTab(index)}
            >
              {tab}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
