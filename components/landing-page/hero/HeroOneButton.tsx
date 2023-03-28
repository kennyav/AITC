import { ReactNode } from 'react';

type IHeroOneButtonProps = {
   title: ReactNode;
   description: string;
   button: ReactNode;
};

export default function HeroOneButton(props: IHeroOneButtonProps) {

   return (
      <header className="text-center">
         <h1 className="text-5xl text-gray-900 font-bold whitespace-pre-line leading-hero">
            {props.title}
         </h1>
         <br></br>
         <br></br>
         <div className="text-2xl mt-4 mb-16">{props.description}
         <h1 className="text-2xl mt-4 mb-16">{ "Private Cloud. Meta Tokens. Crypto. AI. Wallet and much more coming soon!"}</h1>
         </div>

         {props.button}
      </header>
   );
}

