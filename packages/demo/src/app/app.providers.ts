import {
  FactoryProvider,
  Injectable,
  InjectionToken,
  ValueProvider,
} from 'injection-js';

export const appNameToken = new InjectionToken<string>('app name');
export const piToken = new InjectionToken<number>('pi');
export const twoPiToken = new InjectionToken<number>('2 pi');

interface Api {
  version: string;
  callApi(subPath: string): void;
}

export const apiToken = new InjectionToken<Api>('Api');

@Injectable()
export class Config {
  getBackendUrl(): string {
    return 'http://backend';
  }
}

@Injectable()
export class V1Api implements Api {
  readonly version = 'v1';

  constructor(private readonly config: Config) {}

  callApi(subPath: string): void {
    console.log(
      `calling: ${this.config.getBackendUrl()}/api/${this.version}/${subPath}`
    );
  }
}

@Injectable()
export class V2Api implements Api {
  readonly version = 'v2';

  constructor(private readonly config: Config) {}

  callApi(subPath: string): void {
    console.log(
      `calling: ${this.config.getBackendUrl()}/api/${this.version}/${subPath}`
    );
  }
}

export const twoPiFactory = (pi: number) => {
  return 2 * pi;
};

export const AppNameProvider: ValueProvider = {
  provide: appNameToken,
  useValue: 'My injection app',
};

export const PiValueProvider: ValueProvider = {
  provide: piToken,
  useValue: Math.PI,
};

export const TwoPiFactoryProvider: FactoryProvider = {
  provide: twoPiToken,
  useFactory: twoPiFactory,
  deps: [piToken],
};
