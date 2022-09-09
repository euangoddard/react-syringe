# React Syringe

A tiny React wrapper for the capabilities of [injection-js](https://github.com/mgechev/injection-js).

This library provides two elements to allow you to use the hierarchical injector from [injection-js](https://github.com/mgechev/injection-js) effortlessly in your React application.

## Example

```tsx
import 'reflect-metadata';
import { Injectable, Provider } from 'injection-js';
import { FunctionComponent, useEffect } from 'react';
import { Injector, useInjector } from 'react-syringe';

@Injectable()
class HttpClient {
  async get(url: string) {
    // implementation
  }
}

@Injectable()
class ApiClient {
  constructor(private readonly httpClient: HttpClient) {}

  async get(url: string) {
    return this.httpClient.get(`/api/v1/${url}`);
  }
}

// These should be defined outside the application/component since
// useContext is use here and we don't want to cause unnecessary re-renders
const proviers: Provider[] = [HttpClient, ApiClient];

const TodoList: FunctionComponent = () => {
  const injector = useInjector();
  const apiClient = injector.get(ApiClient);

  const [todos, setTodos] = useState([]);
  useEffect(async () => {
    const apiTodos = await apiClient.get('todos');
    setTodos[apiTodos];
  }, []);

  return (
    <ol>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.label}</li>
      ))}
    </ol>
  );
};

const App: FunctionComponent = () => {
  return (
    <Injector providers={proviers}>
      <TodoList />
    </Injector>
  );
};
```

## Installing

```shell
npm install reflect-metadata injection-js react-syringe
```

## Serving the demo

Run `nx serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build

Run `nx build react-syringe` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test react-syringe` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.
