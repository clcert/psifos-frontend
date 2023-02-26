import { useEffect, useRef, useState } from "react";

/**
 * Cambia los valores a porcentaje
 *
 * @param {boolean} checked
 */
const changePercentage = (filteredData, nameRow) => {
  let totalNum = 0;
  filteredData.forEach((row) => {
    totalNum = totalNum + parseInt(row[nameRow]);
  });

  const percentageData = filteredData.map((element) => {
    const percentageValue =
      ((parseInt(element[nameRow]) / totalNum) * 100).toFixed(2).toString() +
      "%";

    return { ...element, [nameRow]: percentageValue };
  });

  return percentageData;
};

/**
 *
 * Filtra la tabla para eliminar valores 0
 *
 * @param {bool} checked Esta activo
 */
const filterCeros = (filteredData, nameRow) => {
  const filterData = [...filteredData].filter((row) => {
    return parseInt(row[nameRow]) !== 0;
  });
  return filterData;
};

export default function ColumnPsifosTable({
  setFilteredData,
  filteredData,
  nameRow,
  data,
  ordenamiento,
  setOrdenamiento,
}) {
  const ref = useRef(null);

  const [buttonActive, setButtonActive] = useState(false);
  const [isFilterCeros, setIsFilterCeros] = useState(true);
  const [isPercentage, setIsPercentage] = useState(false);

  const openButton = () => {
    if (buttonActive) setButtonActive(false);
    else setButtonActive(true);
  };

  /**
   * Filtra la tabla por texto
   *
   * @param {String} textToFilter
   */
  const filterText = (textToFilter) => {
    const filterData = [...data].filter((row) => {
      const textLower = row[nameRow].toLowerCase();
      return textLower.includes(textToFilter);
    });
    setFilteredData(filterData);
  };
  /**
   *
   * Ordena la información de la tabla
   *
   * @param {Num} indexColumn
   */
  const sortData = () => {
    const column = nameRow;
    const ascendente =
      ordenamiento.column === column ? !ordenamiento.ascendente : true;
    const sortedData = [...data].sort((fila1, fila2) => {
      if (fila1[column] < fila2[column]) {
        return ascendente ? -1 : 1;
      } else if (fila1[column] > fila2[column]) {
        return ascendente ? 1 : -1;
      } else {
        return 0;
      }
    });
    applyFilters(sortedData, isFilterCeros, isPercentage);
    setOrdenamiento({
      column,
      ascendente,
    });
  };

  const handlerFilterCeros = (checked) => {
    setIsFilterCeros(checked);
    applyFilters(data, checked, isPercentage);
  };

  const handlerPercentage = (checked) => {
    setIsPercentage(checked);
    applyFilters(data, isFilterCeros, checked);
  };

  /**
   * Aplica los filtros correspondientes
   *
   * @param {boolean} isFilterCeros
   * @param {boolean} isPercentage
   */

  const applyFilters = (data, isFilterCeros, isPercentage) => {
    let filterData = data;
    if (!isFilterCeros) {
      filterData = filterCeros(filterData, nameRow);
    }
    if (isPercentage) {
      filterData = changePercentage(filterData, nameRow);
    }
    setFilteredData(filterData);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setButtonActive(null);
    }
  }

  return (
    <th ref={ref} className="has-text-centered" key={nameRow}>
      <span onClick={() => sortData()}>{nameRow}</span>
      <div className="dropdown mx-2">
        <button className="button-undesigned" onClick={() => openButton()}>
          <i className="fa-solid fa-pen"></i>{" "}
        </button>
        <ul className={"dropdown-menu " + (!buttonActive ? "d-none" : "")}>
          <li>
            <div className="mb-3 px-2">
              <input
                onChange={(e) => filterText(e.target.value)}
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Buscar"
              />
            </div>
          </li>
          <hr />
          <li>
            <div className="form-check form-switch ml-4">
              <input
                checked={isFilterCeros}
                onChange={(e) => {
                  handlerFilterCeros(e.target.checked);
                }}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
              <label className="form-check-label">Valores cero</label>
            </div>
          </li>
          <hr />
          <li>
            <div className="form-check form-switch ml-4">
              <input
                checked={isPercentage}
                onChange={(e) => {
                  handlerPercentage(e.target.checked);
                }}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
              <label className="form-check-label">Porcentajes</label>
            </div>
          </li>
        </ul>
      </div>
      {ordenamiento.column === nameRow && (ordenamiento.ascendente ? "▲" : "▼")}
    </th>
  );
}
