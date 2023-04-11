import { LockClosedIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleState } from '../globalRedux/features/loginSlice';

export default function Login() {
   const [password, setPassword] = useState<string>('');
   const router = useRouter();
   const dispatch = useDispatch();


   const handleSubmit = async (e: any) => {
      e.preventDefault();

      if (process.env.NEXT_PUBLIC_LOGIN_PASSWORD === password) {
         router.push('/section/login');
         dispatch(toggleState(true));
      } else {
         alert("Incorrect password");
      }
   }

   return (
      <>
         <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
               <div className='bg-blue-600 py-12 rounded-md'>
                  <div className="text-center">
                     <h1>AITC</h1>
                     <h1>The Artificial Intelligence Trust Council</h1>
                  </div>
                  <h2 className="mt-6 text-center text-3xl tracking-tight text-black">
                     Enter Passcode
                  </h2>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm">
                     <label htmlFor="password" className="sr-only">
                        Password
                     </label>
                     <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        required
                        className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-1"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-black hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                     >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                           <LockClosedIcon className="h-5 w-5 text-white group-hover:text-blue-400" aria-hidden="true" />
                        </span>
                        Sign in
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </>
   )
}

