import { fireEvent, render, screen } from '@testing-library/react';
import { Injectable, InjectionToken, Provider } from 'injection-js';
import { FunctionComponent } from 'react';
import { useInjector } from 'react-syringe';

import Injector from './injector';

@Injectable()
class Nacelle {
  public readonly name = 'nacelle';
}

interface Engine {
  name: string;
  maxWarpFactor: number;

  engage(): void;
}

@Injectable()
class WarpEngine implements Engine {
  constructor(private readonly nacelle: Nacelle) {}

  get name() {
    return `Warp drive: (${this.nacelle.name})`;
  }
  public readonly maxWarpFactor = 9;

  engage() {
    console.log('warp drive engaged!');
  }
}

@Injectable()
class ImpulseEngine implements Engine {
  constructor() {}

  get name() {
    return 'Impulse engine';
  }
  public readonly maxWarpFactor = 0.1;

  engage() {
    console.log('impulse engine engaged!');
  }
}

const engineToken = new InjectionToken<Engine>('Engine');

const notFoundEngine: Engine = {
  name: '<not found>',
  maxWarpFactor: 0,
  engage() {
    throw new Error('Cannot engage!');
  },
};

const EngineDisplay: FunctionComponent = () => {
  const injector = useInjector();
  const engine = injector.get(engineToken, notFoundEngine);

  return (
    <div>
      <h1 data-testid="engine-name">{engine.name}</h1>
      <p>
        Max warp factor:{' '}
        <span data-testid="max-warp-factor">{engine.maxWarpFactor}</span>
      </p>
      <button
        type="button"
        onClick={() => engine.engage()}
        data-testid="start-button"
      >
        Engage!
      </button>
    </div>
  );
};

const NacelleDisplay: FunctionComponent = () => {
  const injector = useInjector();
  const nacelle = injector.get(Nacelle, { name: '<no nacelle>' });
  return <h2 data-testid="nacelle-name">{nacelle.name}</h2>;
};

describe('Injector', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Simple providers', () => {
    beforeEach(() => {
      render(
        <Injector
          providers={[{ provide: engineToken, useClass: WarpEngine }, Nacelle]}
        >
          <EngineDisplay />
        </Injector>
      );
    });

    it('should render the engine name', () => {
      expect(screen.getByTestId('engine-name').textContent).toBe(
        'Warp drive: (nacelle)'
      );
    });

    it('should render the max warp factor', () => {
      expect(screen.getByTestId('max-warp-factor').textContent).toBe('9');
    });

    it('should call the method on the engine when the button is clicked', () => {
      jest.spyOn(console, 'log');

      fireEvent.click(screen.getByTestId('start-button'));

      expect(console.log).toHaveBeenCalledWith('warp drive engaged!');
    });
  });

  describe('Nested injector', () => {
    const rootProviders: Provider[] = [
      { provide: engineToken, useClass: WarpEngine },
      Nacelle,
    ];
    const childProviders: Provider[] = [
      { provide: engineToken, useClass: ImpulseEngine },
    ];

    beforeEach(() => {
      render(
        <Injector providers={rootProviders}>
          <EngineDisplay />
          <Injector providers={childProviders}>
            <EngineDisplay />
          </Injector>
        </Injector>
      );
    });

    describe('Root engine display', () => {
      it('should render the engine name', () => {
        expect(screen.getAllByTestId('engine-name')[0].textContent).toBe(
          'Warp drive: (nacelle)'
        );
      });

      it('should render the max warp factor', () => {
        expect(screen.getAllByTestId('max-warp-factor')[0].textContent).toBe(
          '9'
        );
      });

      it('should call the method on the engine when the button is clicked', () => {
        jest.spyOn(console, 'log');

        fireEvent.click(screen.getAllByTestId('start-button')[0]);

        expect(console.log).toHaveBeenCalledWith('warp drive engaged!');
      });
    });

    describe('Child engine display', () => {
      it('should render the engine name', () => {
        expect(screen.getAllByTestId('engine-name')[1].textContent).toBe(
          'Impulse engine'
        );
      });

      it('should render the max warp factor', () => {
        expect(screen.getAllByTestId('max-warp-factor')[1].textContent).toBe(
          '0.1'
        );
      });

      it('should call the method on the engine when the button is clicked', () => {
        jest.spyOn(console, 'log');

        fireEvent.click(screen.getAllByTestId('start-button')[1]);

        expect(console.log).toHaveBeenCalledWith('impulse engine engaged!');
      });
    });
  });

  describe('Sibling injectors', () => {
    const child1Providers: Provider[] = [
      { provide: engineToken, useClass: ImpulseEngine },
    ];
    const child2Providers: Provider[] = [Nacelle];

    beforeEach(() => {
      render(
        <>
          <Injector providers={child1Providers}>
            <EngineDisplay />
            <NacelleDisplay />
          </Injector>
          <Injector providers={child2Providers}>
            <EngineDisplay />
            <NacelleDisplay />
          </Injector>
        </>
      );
    });

    describe('First child injector', () => {
      it('should display impulse engine', () => {
        expect(screen.getAllByTestId('engine-name')[0].textContent).toBe(
          'Impulse engine'
        );
      });

      it('should fallback to the not found nacelle', () => {
        expect(screen.getAllByTestId('nacelle-name')[0].textContent).toBe(
          '<no nacelle>'
        );
      });
    });

    describe('Second child injector', () => {
      it('should fallback to the not found engine', () => {
        expect(screen.getAllByTestId('engine-name')[1].textContent).toBe(
          '<not found>'
        );
      });

      it('should display the nacelle name', () => {
        expect(screen.getAllByTestId('nacelle-name')[1].textContent).toBe(
          'nacelle'
        );
      });
    });
  });
});
