import { useState } from "react";
import Button from "../../components/Button";
import LoginPaths from "../../components/Login/LoginPaths";


export default function Login() {
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  // handle aitc passcode
  const handlePasscode = (e: any) => {
    e.preventDefault();
    setPassword(e.target.value)
  }

  // handle function for allowing only those that have the site password to login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_LOGIN_PASSWORD) {
      setIsLogin(true);
    } else {
      alert("Incorrect password");
    }
  }


  return (
    <section>
      <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center items-center justify-center">
            <div className="">
              <span className="sr-only">AITC Polling</span>
              <img className="object-fill" src="/AITCWordsBorderBabyBlue.png" alt="" />
            </div>
            {isLogin ?
              <LoginPaths toggleBack={setIsLogin} back={isLogin} />
              :
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm">
                  <input
                    className="rounded-lg p-1"
                    type="password"
                    placeholder="input password ..."
                    value={password}
                    autoComplete="current-password"
                    required
                    onChange={(e) => handlePasscode(e)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <button type="submit" onClick={handleSubmit} className="text-white text-left font-medium text-xl hover:bg-gray-400 rounded-lg p-2">
                    Sign in
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div >
    </section >
  );
}