import { db } from '@/lib/db';
import AnalyticsChart from './components/analytics-chart';
import { VerticalGraph } from './components/vertical-graph';
import { StackedComponent } from './components/stacked-graph';
// import VerticalGraph from './components/vertical-graph';


  

const page = async() => {
    const obbSheets = await db.obbSheet.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true
        }
    });
    

    return (
        <div>
            {/* <AnalyticsChart
                obbSheets={obbSheets}
                title='Daily Efficiency Chart'
            /> */}
            <VerticalGraph/>
            {/* <StackedComponent></StackedComponent> */}
        </div>
    )
}

export default page;