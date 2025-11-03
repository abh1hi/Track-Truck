// Create app user and database with proper roles
// This will run automatically by Mongo image during first container start
print('Initializing MongoDB users and databases...');

const admin = db.getSiblingDB('admin');
admin.auth(process.env.MONGO_INITDB_ROOT_USERNAME || 'root', process.env.MONGO_INITDB_ROOT_PASSWORD || 'example');

const dbName = process.env.MONGO_INITDB_DATABASE || 'track-truck';
const appUser = 'trackuser';
const appPass = 'trackpass';

const appdb = db.getSiblingDB(dbName);
appdb.createUser({
  user: appUser,
  pwd: appPass,
  roles: [ { role: 'readWrite', db: dbName } ]
});

print(`Created user ${appUser} for database ${dbName}`);
