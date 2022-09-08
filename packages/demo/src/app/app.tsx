import { Provider } from 'injection-js';
import { Injector } from 'react-syringe';
import styles from './app.module.css';
import {
  apiToken,
  AppNameProvider,
  Config,
  PiValueProvider,
  TwoPiFactoryProvider,
  V1Api,
  V2Api,
} from './app.providers';
import { ApiDisplay, AppName, PiDisplay } from './components';

export function App() {
  const rootProviders: Provider[] = [
    Config,
    AppNameProvider,
    PiValueProvider,
    TwoPiFactoryProvider,
  ];

  const panel1Providers: Provider[] = [
    {
      provide: apiToken,
      useClass: V1Api,
    },
  ];

  const panel2Providers: Provider[] = [
    {
      provide: apiToken,
      useClass: V2Api,
    },
  ];

  return (
    <main className={styles['main']}>
      <h1>React injection demo</h1>
      <Injector providers={rootProviders}>
        <AppName />
        <PiDisplay />

        <div className={styles['twoGrid']}>
          <div>
            <Injector providers={panel1Providers}>
              <ApiDisplay />
            </Injector>
          </div>
          <div>
            <Injector providers={panel2Providers}>
              <ApiDisplay />
            </Injector>
          </div>
        </div>
      </Injector>
    </main>
  );
}

export default App;
