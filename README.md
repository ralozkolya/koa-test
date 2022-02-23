# Take-home task for Node.js (Typescript) Back-End Developer position

### Requirements:
- Node.js (tested with v15.10.0);
- NPM (tested with v7.6.0);

### To install the dependencies, run: `npm i`

### Supported commands
- `npm run build` - Produces the production build;
- `npm start` - Starts the development server;
- `npm run dev` - Starts the build process in 'watch' mode and also starts the development server.

### Configuration
Configuration is done using the environmental variables. Currently are supported the following:
- PORT - Port number for web server to listen to (default 3000);
- DB_PROVIDER - 'mock' (default) or 'mongo'. If 'mock' is provided, application will run its own in-memory database. Otherwise, following variables become mandatory.
- DB_HOST - MongoDB instance hostname;
- DB_USER - MongoDB username;
- DB_PASS - MongoDB password;
- DB_NAME - Database name;

DotEnv package is installed, so an easy way to provide env vars is to place them in .env file in the root folder (See env.example for reference).