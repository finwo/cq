(new Function('return this;'))().m = require('mithril');
import screenMain from './screen/main';
import migrations from './migrations';

const navi = {
  "/main": screenMain,
};

document.addEventListener('deviceready', async function() {

  const db = window.sqlitePlugin.openDatabase({
    name: 'testdb',
    location: 'default',
    androidDatabaseProvider: 'system',
  });

  await new Promise((r, e) => db.executeSql('CREATE TABLE IF NOT EXISTS _migrations (name, iat)', e, r));
  const doneMigrations = await new Promise(r => db.executeSql('SELECT name, iat FROM _migrations', [], r));
  console.log(doneMigrations.rows.length, doneMigrations);

  for(const migration of migrations) {
    // TODO: dedup
    await new Promise((r, e) => {
      db.transaction(function(tx) {
        tx.executeSql(migration.sql);
        tx.executeSql(`INSERT INTO _migrations VALUES (?, ?)`, [migration.name, Date.now()]);
      }, function(err) {
        e(err);
      }, function() {
        r();
      });
    });

  }

  const afterMigrations = await new Promise(r => db.executeSql('SELECT name, iat FROM _migrations', [], r));
  console.log(afterMigrations.rows.length, afterMigrations);

  console.log('migrations table exists now');

  const ficon = document.getElementById('floaticon');
  m.route(document.body, "/main", navi);
  document.body.appendChild(ficon);
  setTimeout(() => ficon.className = 'fade', 0);

  console.log(db);

});

