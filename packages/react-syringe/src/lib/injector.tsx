import { Provider, ReflectiveInjector } from 'injection-js';
import { ReactNode, useContext } from 'react';
import { InjectionContext } from './injection.context';

export interface InjectorProps {
  providers: Provider[];
  children: ReactNode;
}

export function Injector({ providers, children }: InjectorProps) {
  const parentInjector = useContext(InjectionContext);
  const injector = ReflectiveInjector.resolveAndCreate(
    providers,
    parentInjector
  );

  return (
    <InjectionContext.Provider value={injector}>
      {children}
    </InjectionContext.Provider>
  );
}

export default Injector;
