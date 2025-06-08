// import "dotenv/config"
// import { Client } from "pg"
// import {drizzle} from "drizzle-orm/node-postgres";
// import * as schema from "./schema"
 
 
// export const client = new Client({
//     connectionString: process.env.DATABASE_URL as string
// });
 
// const main = async () =>{
//     await client.connect(); //connect to the database  
// }
 
// main().catch(console.error)
 
// const db = drizzle(client,{schema, logger:true});
// export default db;


// Load environment variables from .env file
import 'dotenv/config';

// Import Neon serverless PostgreSQL client
import { neon } from '@neondatabase/serverless';

// Import Drizzle for Neon HTTP driver
import { drizzle } from 'drizzle-orm/neon-http';

// Import schema definitions
import * as schema from './schema';

// Initialize the Neon client using the DATABASE_URL from .env
const client = neon(process.env.DATABASE_URL!);

// Create a Drizzle ORM instance with the Neon client and schema
const db = drizzle(client, { schema, logger: true });

// Export the database instance for use in the app
export default db;
