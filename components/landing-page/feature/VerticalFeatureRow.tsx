import className from 'classnames';
import Image from 'next/image';

type IVerticalFeatureRowProps = {
   title: string;
   description: string;
   image: any;
   imageAlt: string;
   reverse?: boolean;
};

export default function VerticalFeatureRow(props: IVerticalFeatureRowProps) {
   const verticalFeatureClass = className(
      'mt-20',
      'flex',
      'flex-wrap',
      'items-center',
      {
         'flex-row-reverse': props.reverse,
      }
   );

   return (
      <div className={verticalFeatureClass}>
         <div className="w-full sm:w-1/2 text-center text-white sm:px-6">
            <h3 className="uppercase font-bold whitespace-pre-line leading-hero">{props.title}</h3>
            <div className="mt-6 text-xl leading-9">{props.description}</div>
         </div>

         <div className='w-full sm:w-1/2 p-6'>
            <Image src={props.image} alt={props.imageAlt} />
         </div>
      </div>
   );
};

