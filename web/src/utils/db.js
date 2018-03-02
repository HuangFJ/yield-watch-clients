import { DB_NAME, DB_VERSION } from '../constants';

class Store {
    constructor(db, tableName) {
        this._db = db;
        this._tableName = tableName;
    }

    init(storeCore) { }

    createIndex() { }

    get(key) {
        return this._db
            .connect()
            .then(conn =>
                new Promise((resolve, reject) => {
                    const getTx = conn.transaction([this._tableName])
                        .objectStore(this._tableName)
                        .get(key);
                    getTx.onsuccess = event => resolve(event.target.result);
                    getTx.onerror = reject;
                })
            );
    }

    put(key, value) {
        return this._db
            .connect()
            .then(conn =>
                new Promise((resolve, reject) => {
                    const putTx = conn.transaction([this._tableName], 'readwrite')
                        .objectStore(this._tableName)
                        .put(value, key);
                    putTx.onsuccess = event => resolve(event.target.result);
                    putTx.onerror = reject;
                })
            );
    }

    remove(key) {
        return this._db
            .connect()
            .then(conn =>
                new Promise((resolve, reject) => {
                    const deleteTx = conn.transaction([this._tableName], 'readwrite')
                        .objectStore(this._tableName)
                        .delete(key);
                    deleteTx.onsuccess = event => resolve(event.target.result);
                    deleteTx.onerror = reject;
                })
            );
    }
}

class Database {
    constructor(name, dbVersion) {
        this._dbName = name;
        this._dbVersion = dbVersion;
        this._connected = false;
        this._stores = new Map();
    }

    get _indexedDB() {
        return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    }

    connect() {
        if (this._connected) return Promise.resolve(this._conn);

        const request = this._indexedDB.open(this._dbName, this._dbVersion);
        const that = this;

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                that._connected = true;
                that._conn = request.result;
                resolve(request.result);
            };

            request.onerror = reject;
            request.onupgradeneeded = event => that._initDB(event);
        });
    }

    _initDB(event) {
        const conn = event.target.result;
        const oldVersion = event.oldVersion;
        console.log(conn.objectStoreNames);
        for (const [tableName, store] of this._stores) {
            if (oldVersion !== 0 && conn.objectStoreNames.contains(tableName)) {
                conn.deleteObjectStore(tableName);
            }
            const storeCore = conn.createObjectStore(tableName);
            store.init(storeCore);
        }
    }

    newObjectStore(tableName) {
        if (!this._stores.has(tableName)) {
            this._stores.set(tableName, new Store(this, tableName));
        }

        return this._stores.get(tableName);
    }

    close() {
        if (this._connected) {
            this._connected = false;
            this._conn.close();
        }
    }

    async destroy() {
        await this.close();
        return new Promise((resolve, reject) => {
            const req = this._indexedDB.deleteDatabase(this._dbName);
            req.onsuccess = resolve;
            req.onerror = reject;
        });
    }
}

const db = new Database(DB_NAME, DB_VERSION);
export const baseStore = db.newObjectStore('base');
