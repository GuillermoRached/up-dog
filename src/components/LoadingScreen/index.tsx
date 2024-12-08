const LoadingScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 dark:border-green-400 mb-4"></div>
          <h2 className="text-2xl font-semibold dark:text-white">Finding Your Perfect Match</h2>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your preferences...</p>
        </div>
      </div>
    );
  };
  
  export default LoadingScreen;