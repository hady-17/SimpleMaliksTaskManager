export default function SmartPlanModal({ loading, error, data, onClose, onRetry }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            ✨ Smart Plan for Today
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm">Thinking through your day...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              {error}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <div className="flex flex-col gap-5">
            {data.raw ? (
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {data.raw}
              </pre>
            ) : (
              <>
                {data.plan.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Today's plan
                    </h3>
                    <ol className="flex flex-col gap-2">
                      {data.plan.map((step, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm rounded-lg border border-gray-100 dark:border-gray-700 p-2.5"
                        >
                          <span className="font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                            {step.time}
                          </span>
                          <span className="flex flex-col">
                            <span className="text-gray-800 dark:text-gray-100">{step.task}</span>
                            {step.note && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {step.note}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {data.tips.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Tips to save energy &amp; work smart
                    </h3>
                    <ul className="flex flex-col gap-1.5 list-disc pl-5">
                      {data.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
