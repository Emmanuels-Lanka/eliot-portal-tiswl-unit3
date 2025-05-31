
import TvDailyAchivements from "./_actions/tv-daily-achivements";

const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">
      <TvDailyAchivements linename={params.linename}/>
    </div>
  )
}
export default Page;