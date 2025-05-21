import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Use dynamic import to handle potential client-side only components
const CalculatorForm = dynamic(
  () => import('./_components/calculatorForm-compo').then(mod => mod.default),
  { 
    loading: () => <div className="p-4 text-center">Loading calculator...</div>,
    ssr: false // Disable server-side rendering for this component
  }
)

function RoiCalculatorPage() {
  return (
    <>
    <div>
      <div className='mx-4 flex items-center justify-center gap-4'>
        <Image src={"/eliot-logo.png"} alt='Eliot Logo' height={150} width={150} />
        <h1 className='text-[#0071c1] my-4 text-2xl'>Return of Investment Calculator</h1>
      </div>
      
      <CalculatorForm/>
    </div>
    </>
  )
}

export default RoiCalculatorPage