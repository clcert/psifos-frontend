import PieChart from "../../../../component/Charts/PieChart";
import SimpleHorizontalTable, { renderTableData }
from "../../../../component/Tables/HorizontalTable";

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
      <div className="box" style={{width: '100%'}}>
        <SectionTitle
          title={title}
        />
        <div className="statistic-content-container">
          <div className="statistic-pie-chart-container">
            <PieChart
              data={pieChartData}
              legendPosition={{
                left: '40%',
                top: '10%',
                align: 'left',
                center: ['20%', '20%'],
              }}
              chartPosition={{
                center: ['15%', '23%'],
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