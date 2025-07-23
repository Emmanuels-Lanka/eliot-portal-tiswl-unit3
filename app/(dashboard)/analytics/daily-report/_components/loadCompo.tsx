export function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="text-center max-w-lg mx-auto">
        {/* Maintenance icon with calendar */}
        <div className="relative inline-flex justify-center items-center mb-8">
          <div className="absolute border-4 border-blue-200 rounded-full w-28 h-28"></div>
          <div className="absolute border-t-4 border-blue-500 rounded-full w-28 h-28 animate-spin"></div>
          <svg
            className="w-14 h-14 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Timeline message */}
        <h2 className="text-3xl font-bold text-blue-800 mb-3">
          Report System Upgrade
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 mb-3">
            <span className="font-semibold">Maintenance Window:</span> 
            <br />
            {/* Expected completion in <span className="font-bold text-blue-800">2-3 business days</span> */}
          </p>
          <p className="text-blue-600 text-sm">
            We appreciate your patience as we implement these important improvements.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center justify-center ">
<div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-blue-700">Data validation in progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded-full mr-3"></div>
            <span className="text-blue-600">Report structure migration</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded-full mr-3"></div>
            <span className="text-blue-500">Continous testing</span>
          </div>
        </div>
        </div>
        

        {/* Contact information */}
        <div className="mt-8 text-sm text-blue-500">
          Thank you for your understanding and support during this upgrade process.
          {/* <a href="mailto:support@yourcompany.com" className="text-blue-600 font-medium ml-1">
            support@yourcompany.com
          </a> */}
        </div>
      </div>
    </div>
  );
}