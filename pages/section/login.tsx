import { useState } from "react";
import Button from "../../components/Button";
import LoginPaths from "../../components/LoginPaths";


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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center items-center justify-center">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <div className="text-center">
                AITC
                <br />
                The Artificial Intelligence Trust Council
              </div>
            </a>
            {isLogin ?
              <LoginPaths />
              :
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm">
                  <input
                    type="password"
                    placeholder="input password ..."
                    value={password}
                    autoComplete="current-password"
                    required
                    onChange={(e) => handlePasscode(e)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <Button type="submit" variant="outline" onClick={handleSubmit} size="sm" className="justify-center text-white">
                    Sign in
                  </Button>
                </div>
              </form>
            }
          </div>
        </div>
      </div >
    </section >
  );
}