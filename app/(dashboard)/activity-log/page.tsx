import { db } from "@/lib/db"
import ActivityBanner from "./_components/activity-banner";
import moment from "moment-timezone";

const Dashboard = async () => {
    const activities = await db.activityLog.findMany({
        orderBy: {
            timestamp: 'desc'
        }
    });
 const timezone = process.env.NODE_ENV === "development" ? "Asia/Colombo" : "Asia/Dhaka";
    return (
        <section className='mx-auto max-w-7xl'>
            <h1 className="my-6 text-2xl font-semibold">Activity Log</h1>
            <div className="space-y-4">
                {activities.length ? activities.map((activity) => (
                    <ActivityBanner
                        key={activity.id}
                        part={activity.part}
                        activity={activity.activity}
                        timestamp={moment(activity.timestamp).tz(timezone).format("YYYY-MM-DD HH:mm:ss")}
                    />
                )) : (
                    <p className="text-center text-slate-500">No activities found</p>
                )}
            </div>
        </section>
    )
}

export default Dashboard
