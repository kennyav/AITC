import React from 'react'

export default function createAccount() {
  return (
    <section>
      <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center items-center justify-center">
            <form className="mt-8 space-y-6" onSubmit={() => { }}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm">
                <input
                  className="rounded-lg p-1"
                  type="password"
                  placeholder="input password ..."
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="flex flex-col items-center">
                <button type="submit" className="text-white text-left font-medium text-xl hover:bg-gray-400 rounded-lg p-2">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
