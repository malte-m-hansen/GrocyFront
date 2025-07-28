# GrocyFront

GrocyFront is an Angular web frontend for Grocy, designed to display and manage stock amounts, locations, and product groups.

## Features

- View and filter products by location and group
- Sort products by name, stock, last used, last purchased, or Grocy ID
- Add, consume, and open products
- View product details in a modal
- Responsive design

## Setup

1. **Environment Configuration**

   The environment file (`src/environment/environment.ts`) is generated automatically during build using environment variables.  
   For local development, copy the example file and edit as needed:

   ```bash
   cp src/environment/environment.example.ts src/environment/environment.ts
   ```

   Add your Grocy API key and API URL to `src/environment/environment.ts`.

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Development Server

Run the development server:

```bash
npm start
```

Navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload if you change any source files.

## Build

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Unit Tests

Run unit tests via [Karma](https://karma-runner.github.io):

```bash
npm test
```

## Cloudflare Pages Deployment

This project is compatible with [Cloudflare Pages](https://pages.cloudflare.com/):

- The build process automatically generates `src/environment/environment.ts` using environment variables.
- Set the following environment variables in your Cloudflare Pages project settings:
  - `GROCY_API_KEY`
  - `GROCY_API_URL`
- Use `npm run build` as your build command.
- Set Build output to `Build output:dist/grocy-front/browser`

## Security Warning

⚠️ **Warning:**  
When deploying publicly, the Grocy API key is sent in clear text in the request headers.  
Anyone with access to the deployed page will be able to see the API key in their browser’s network requests.  
**Do not use a privileged API key or one with write access for public deployments.**  
Consider using a proxy or server-side solution if you need to keep your API key secret.

## Code Scaffolding

Generate a new component:

```bash
ng generate component component-name
```

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.