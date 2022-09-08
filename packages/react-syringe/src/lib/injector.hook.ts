import { Injector } from 'injection-js';
import { useContext } from 'react';
import { InjectionContext } from './injection.context';

export const useInjector = (): Injector => {
  return useContext(InjectionContext);
};
