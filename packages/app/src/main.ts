(new Function('return this;'))().m = require('mithril');
import "@fontsource/nunito/400.css";

import screenMain from './screen/main';
const navi = {
  "/main": screenMain,
};

import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite, applyPolyfills } from "jeep-sqlite/loader";
if (Capacitor.getPlatform() == 'web') {
  applyPolyfills().then(() => {
    jeepSqlite(window);
  });
}

import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult,
         capNCDatabasePathResult } from '@capacitor-community/sqlite';
const sqlitePlugin = CapacitorSQLite;
const sqliteConnection = new SQLiteConnection(sqlitePlugin);

// Web polyfill
if (Capacitor.getPlatform() == 'web') {
  const elJeepSqlite = document.createElement('jeep-sqlite');
  document.body.appendChild(elJeepSqlite);
  await customElements.whenDefined('jeep-sqlite');
  await sqliteConnection.initWebStore();
}

// Open a Database
const openDatabase = async (
  dbName    : string,
  encrypted : boolean,
  mode      : string,
  version   : number,
  readonly  : boolean
): Promise<SQLiteDBConnection | undefined> => {
  let db: SQLiteDBConnection;
  const retCC = (await sqliteConnection.checkConnectionsConsistency()).result;
  const isConn = (await sqliteConnection.isConnection(dbName, readonly)).result;
  if(retCC && isConn) {
    db = await sqliteConnection.retrieveConnection(dbName, readonly);
  } else {
    db = await sqliteConnection
              .createConnection(dbName, encrypted, mode, version, readonly);
  }

  try {
    await db.open();
  } catch(e) {
    document.body.innerText = '\n\nError loading database';
    throw e;
  }
  return db;
}

// (new Function('return this;'))()._db = await openDatabase('main', true, 'encryption', 1, false);
(new Function('return this;'))()._db = await openDatabase('main', false, 'no-encryption', 1, false);

// And finally initialize the views of the app
const ficon = document.getElementById('floaticon');
m.route(document.body, "/main", navi);
document.body.appendChild(ficon);
setTimeout(() => {
    ficon.className = 'fade'
    setTimeout(() => ficon.parentElement.removeChild(ficon), 400);
}, 100);
