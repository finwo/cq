import { SQLocal } from 'sqlocal';

// import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm';

// let promiser = null;

export async function openDatabase(dbname) {

  console.log(SQLocal);

//   // Start new background worker
//   if (!promiser) {
//     promiser = await new Promise((resolve) => {
//       const _promiser = sqlite3Worker1Promiser({
//         onready: () => resolve(_promiser),
//       });
//     });
//   }
//
//   response = await promiser('config-get', {});
//   console.log('Running SQLite3 version', response.result.version.libVersion);

};
