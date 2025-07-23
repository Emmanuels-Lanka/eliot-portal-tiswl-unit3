export function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Simplified spinner */}
        <div className="relative inline-flex justify-center items-center mb-8">
          <div className="absolute border-4 border-blue-200 rounded-full w-24 h-24"></div>
          <div className="absolute border-t-4 border-blue-500 rounded-full w-24 h-24 animate-spin"></div>
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1.5"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-blue-800 mb-2">
          Under Construction
        </h2>
        <p className="text-blue-600 mb-6">Please wait while we prepare something amazing</p>

        {/* Subtle animated dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
}