import { ReactNode } from 'react';

type IBackgroundProps = {
  children: ReactNode;
  color: string;
};

export default function Background(props: IBackgroundProps){
  return <div className={props.color}>{props.children}</div>;
};


