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
  hideZeros,
  nameRow,
  data,
  ordenamiento,
  setOrdenamiento,
}) {
  const ref = useRef(null);

  const [buttonActive, setButtonActive] = useState(false);
  const [isFilterCeros, setIsFilterCeros] = useState(true);
  const isPercentage = false

  const openButton = () => {
    if (buttonActive) setButtonActive(false);
    else setButtonActive(true);
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
      let firstValue = fila1[column];
      let secondValue = fila2[column];

      // Si es un porcentaje le quitamos el formateo
      if (typeof firstValue === "string" && firstValue.includes("%")) {
        firstValue = parseInt(firstValue.replace(".", "").replace("%", ""));
        secondValue = secondValue.replace(".", "").replace("%", "");
      }

      // Comparamos los valores
      if (firstValue < secondValue) {
        return ascendente ? -1 : 1;
      } else if (firstValue > secondValue) {
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
      {hideZeros && (
        <div className="dropdown mx-2">
          <button className="button-undesigned" onClick={() => openButton()}>
            <i className="fa-solid fa-caret-down table-header-icon"/>
          </button>
          <ul className={"dropdown-menu " + (!buttonActive ? "d-none" : "")}>
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
          </ul>
        </div>
      )}
      {ordenamiento.column === nameRow && (ordenamiento.ascendente ? "▲" : "▼")}
    </th>
  );
}
