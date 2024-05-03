import { PieChart } from "../../../../component/Charts/PieChart";
import SimpleHorizontalTable from "../../../../component/Tables/HorizontalTable";

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
        <div style={{display: 'flex'}}>
          <div style={{width: '50%', height: '120px'}}>
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
          <div style={{width: '50%'}}>
            <SimpleHorizontalTable contentPerRow={tableData} />
          </div>
        </div>
      </div>
    );
  }