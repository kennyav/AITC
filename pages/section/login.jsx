"use client";

import { useContext, useState } from "react";
import { getPublicKey, generatePrivateKey } from "nostr-tools";
import { KeysContext } from "../../context/keys-provider.jsx";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toggleState } from "../../globalRedux/features/loginSlice";
import Button from "../../components/Button";


export default function Login() {
  // @ts-ignore
  const { keys, setKeys } = useContext(KeysContext);
  const [privKey, setPrivateKey] = useState("");
  const [pubKey, setPublicKey] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // set public key and keys for context
  const handlePublicKey = (pkey) => {
    const publicKey = getPublicKey(pkey);
    // might not need this setter
    setPublicKey(publicKey);
    setKeys({ privateKey: pkey, publicKey: publicKey });
  }

  // generate private and public keys
  const handleGenerateKeys = () => {
    const privateKey = generatePrivateKey();
    setPrivateKey(privateKey);
    handlePublicKey(privateKey);
  }

  // handle setting the private key
  const handlePrivateKey = (e) => {
    e.preventDefault();
    setPrivateKey(e.target.value)
    handlePublicKey(e.target.value);
  }

  // handle aitc passcode
  const handlePasscode = (e) => {
    e.preventDefault();
    setPassword(e.target.value)
  }

  // handles logining in the user with their private key and 
  const handleLogin = (e) => {

    e.preventDefault();

    if (keys.privateKey !== null && keys.publicKey !== null) {
      dispatch(toggleState(true));
      router.push('/section/landingPage');
    }
  }

  // handle function for allowing only those that have the site password to login
  const handleSubmit = async (e) => {
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
              <form onSubmit={(e) => handleLogin(e)} noValidate>
                <input type="text" placeholder="input private key ..." value={privKey} name="inputField" id="inputField" style={{ textOverflow: "ellipsis" }} onChange={(e) => handlePrivateKey(e)} />
                <div className="flex flex-col items-center">
                  <Button variant="outline" type="button" className="justify-center text-white" onClick={() => handleGenerateKeys()} size="sm">
                    Generate Keys
                  </Button>
                  <Button variant="outline" type="submit" className="justify-center text-white" size="sm">
                    Login
                  </Button>
                </div>
              </form>
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