import PieChart from "../../../../../component/Charts/PieChart";
import SimpleHorizontalTable, { renderTableData }
from "../../../../../component/Tables/HorizontalTable";

function SectionTitle({title}) {
    return (
      <div style={{fontWeight: "bold"}}>
        {title}
      </div>
    )
  }
  
  
export default function Statistic({
    title, pieChartData, tableData,
}) {
    return (
      <div className="box statistic-container">
        <SectionTitle
          title={title}
        />
        <div className="statistic-content-container">
          <div className="statistic-pie-chart-container">
            <PieChart
              data={pieChartData}
              legendPosition={{
                right: 'right',
                top: 'center'
              }}
              chartPosition={{
                center: ['15%', '50%'],
              }}
              mediaChartPosition={{
                center: ['50%', '50%'],
              }}
            />
          </div>
          <div className="statistic-table-container">
            <SimpleHorizontalTable
              contentPerRow={renderTableData(tableData)}
            />
          </div>
        </div>
      </div>
    );
  }