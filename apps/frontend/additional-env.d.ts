declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: "development" | "production";
        CRAWLER_URL: string;
        DATABASE_URL: string;
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
  