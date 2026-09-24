# Flights42

## Starting the Client

Installing Dependencies:

```bash
npm i
```

Running the frontend:

```bash
ng serve -o
```

## Hands-On Tasks

1. Run `npx sheriff list src/main.ts` in the root folder to list all the found modules.
2. Open `CheckinPage` and inject the `LuggageClient` into the component.
   What happens and why?
3. Running `npx sheriff verify src/main.ts` you can run the checks and get a list of all the violations. What is the problem and what needs to be changed inside the `sheriff.config.ts` file, such that the check passes?
   Verify that the code cannot be commited due to pre-commit hooks. Inspect how this can be done using `ng-lint-staged`
