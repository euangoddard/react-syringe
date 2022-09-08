import type { Injector as IInjector } from 'injection-js';
import { ReflectiveInjector } from 'injection-js';
import { createContext } from 'react';

export const InjectionContext = createContext<IInjector>(
  ReflectiveInjector.resolveAndCreate([])
);
