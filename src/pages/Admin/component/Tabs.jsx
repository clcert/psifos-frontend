export default function Tabs({
  tabs, actualTab, setActualTab,
}) {
  return (
    <ul className="nav nav-tabs mb-4">
      {tabs.map((tab, index) => {
        return (
          <li className="nav-item" key={index} style={{maxWidth: `${100/tabs.length}%`}}>
            <button
              type="button"
              className={"nav-link " + (actualTab === index ? "active" : "")}
              onClick={() => setActualTab(index)}
            >
              {tab}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
