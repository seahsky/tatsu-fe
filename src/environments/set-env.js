const setEnv = () => {
  const fs = require("fs");
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = "./src/environments/environment.prod.ts";
  // Load node modules
  const colors = require("colors");
  const appVersion = require("../../package.json").version;
  require("dotenv").config({
    path: ".env",
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
    backendApiUrl: '${process.env.BACKEND_API_URL}',
    defaultCollectionSymbol: '${process.env.DEFAULT_COLLECTION_SYMBOL}',
    refreshInterval: '${parseInt(process.env.REFRESH_INTERVAL)}',
    appVersion: '${appVersion}',
    production: true,
  };
  `;
  console.log(
    colors.magenta(
      "The file `environment.ts` will be written with the following content: \n"
    )
  );
  writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        colors.magenta(
          `Angular environment.ts file generated correctly at ${targetPath} \n`
        )
      );
    }
  });
};

setEnv();
