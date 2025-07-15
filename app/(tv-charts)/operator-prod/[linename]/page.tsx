import AnalyticsChart from "./_compo/analytics";


const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename

  console.log(params.linename)
  return (
    <div className="h-[300px]  ">
      <AnalyticsChart obbSheetId={params.linename}/>
    </div>
  )
}
export default Page;