import { FunctionComponent } from 'react';
import { useInjector } from 'react-syringe';
import { apiToken, appNameToken, piToken, twoPiToken } from './app.providers';

export const AppName: FunctionComponent = () => {
  const injector = useInjector();
  const appName = injector.get(appNameToken);
  return <h2>App name: {appName}</h2>;
};

export const PiDisplay: FunctionComponent = () => {
  const injector = useInjector();
  const pi = injector.get(piToken);
  const twoPi = injector.get(twoPiToken);
  return (
    <h2>
      𝜋: {pi}; 2𝜋: {twoPi}
    </h2>
  );
};

export const ApiDisplay: FunctionComponent = () => {
  const injector = useInjector();
  const api = injector.get(apiToken);
  return (
    <>
      <h2>API version: {api.version}</h2>
      <button type="button" onClick={() => api.callApi('my-path')}>
        Call API!
      </button>
      <small>Check console!</small>
    </>
  );
};
