(new Function('return this;'))().m = require('mithril');
import "@fontsource/nunito/400.css";

import screenMain from './screen/main';
const navi = {
  "/main": screenMain,
};

import { Capacitor } from '@capacitor/core';
import { sessionRepository, profileRepository } from './storage';



console.log(await sessionRepository.find());
console.log(await profileRepository.find());

console.log(await sessionRepository.put('default', {
  foo: 'bar'
}));

console.log(await sessionRepository.get('default'));

// import { defineCustomElements as jeepSqlite, applyPolyfills } from "jeep-sqlite/loader";
// if (Capacitor.getPlatform() == 'web') {
//   applyPolyfills().then(() => {
//     jeepSqlite(window);
//   });
// }

// import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
//          capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult,
//          capNCDatabasePathResult } from '@capacitor-community/sqlite';
// const sqlitePlugin = CapacitorSQLite;
// const sqliteConnection = new SQLiteConnection(sqlitePlugin);

// // Web polyfill
// if (Capacitor.getPlatform() == 'web') {
//   const elJeepSqlite = document.createElement('jeep-sqlite');
//   document.body.appendChild(elJeepSqlite);
//   await customElements.whenDefined('jeep-sqlite');
//   await sqliteConnection.initWebStore();
// }

// // Open a Database
// const openDatabase = async (
//   dbName    : string,
//   encrypted : boolean,
//   mode      : string,
//   version   : number,
//   readonly  : boolean
// ): Promise<SQLiteDBConnection | undefined> => {
//   let db: SQLiteDBConnection;
//   const retCC = (await sqliteConnection.checkConnectionsConsistency()).result;
//   const isConn = (await sqliteConnection.isConnection(dbName, readonly)).result;
//   if(retCC && isConn) {
//     db = await sqliteConnection.retrieveConnection(dbName, readonly);
//   } else {
//     db = await sqliteConnection
//               .createConnection(dbName, encrypted, mode, version, readonly);
//   }
//   try {
//     await db.open();
//   } catch(e) {
//     document.body.innerText = '\n\nError loading database';
//     throw e;
//   }
//   return db;
// }

// // (new Function('return this;'))()._db = await openDatabase('main', true, 'encryption', 1, false);
// (new Function('return this;'))()._db = await openDatabase('main', false, 'no-encryption', 1, false);

// const res = await _db.query(`
//   SELECT name
//   FROM sqlite_schema
//   WHERE type='table'
//   ;
// `);
//   // -- AND name NOT LIKE 'sqlite_%'

// let insertQuery = 'INSERT INTO contacts (name,FirstName,email,company,age,MobileNumber) VALUES (?, ?, ?, ?, ?, ?) -- Add Sue Hellen;';
//  let bindValues = ["Hellen","Sue","sue.hellen@example.com",,42,"4406050807"];
//  let ret = await _db.run(insertQuery, bindValues);

// console.log(res);

// // Initialize migrations table
// await _db.execute(`
//   CREATE TABLE IF NOT EXISTS _migrations (
//     name        TEXT NOT NULL,
//     migrated_at INTEGER NOT NULL,
//     PRIMARY KEY (name)
//   )
// `);

// const rez = await _db.query(`
//   SELECT name
//   FROM sqlite_schema
//   WHERE type='table'
//   ;
// `);
//   // -- AND name NOT LIKE 'sqlite_%'

// console.log(rez);

// console.log({ res });

// const req = await _db.query(`SELECT * FROM _migrations`);
// console.log({ req });

// for(const migration of require('./migrations')) {
//   console.log(migration);
// }

// And finally initialize the views of the app
const ficon = document.getElementById('floaticon');
m.route(document.body, "/main", navi);
document.body.appendChild(ficon);
setTimeout(() => {
    ficon.className = 'fade'
    setTimeout(() => ficon.parentElement.removeChild(ficon), 400);
}, 100);
