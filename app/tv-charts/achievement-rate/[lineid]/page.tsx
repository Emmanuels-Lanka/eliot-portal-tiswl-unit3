import AchievementRate from "@/components/tv-charts/achievement-rate/tv-achievement-rate";

const TvAchievementRate=({ params }: { params: { linename: string } })=>{
  const name=params.linename
  return(
    <>
     
     <AchievementRate linename={params.linename}/>
    </>
  )
}
export default TvAchievementRate;