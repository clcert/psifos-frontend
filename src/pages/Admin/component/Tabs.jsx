export default function Tabs(props) {
  return (
    <ul class="nav nav-tabs mb-4">
      {props.tabs.map((tab, index) => {
        return (
          <li class="nav-item">
            <button
              type="button"
              class={"nav-link " + (props.actualTab === index ? "active" : "")}
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
