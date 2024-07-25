import { Buffer } from 'buffer';

class NotFoundError extends Error {}
class FileSystemTypeError extends Error {}

type ChainedStorageEntry = {
  type: 'directory' | 'file';
  name: string;
} | {
  type: 'delete' | 'contents' | 'keys' | 'values' | 'entries';
};

// Half-promise half-chained interface for OPFS
export function chainedStorage(path?: ChainedStorageEntry[]) {
  let q = navigator.storage.getDirectory();
  return {
    directory(name: string) {
      q = q.then(handle => handle.getDirectoryHandle(name, { create: true }));
      return this;
    },
    _iterator(name: string, type: string) {
      return q.then(async handle => {
        if (!(handle instanceof FileSystemDirectoryHandle)) return new FileSystemTypeError();
        const result = [];
        for await(const entry of handle[type]()) {
          result.push(entry);
        }
        return result;
      });
    },
    keys(name: string) {
      return this._iterator(name, 'keys');
    },
    values(name: string) {
      return this._iterator(name, 'values');
    },
    entries(name: string) {
      return this._iterator(name, 'entries');
    },
    del(name: string) {
      return q.then(handle => {
        return handle.removeEntry(name);
      });
    },
    get(name: string) {
      return q.then(async handle => {
        let fileHandle = null;
        try {
          fileHandle = await handle.getFileHandle(name);
        } catch(e) {
          return e;
        }
        const file = await fileHandle.getFile();
        return Buffer.from(await file.arrayBuffer());
      });
    },
    put(name: string, contents: Buffer) {
      return q.then(async handle => {
        let fileHandle = null;
        try {
          fileHandle = await handle.getFileHandle(name, { create: true });
        } catch(e) {
          return e;
        }
        const stream = await fileHandle.createWritable();
        await stream.write(contents);
        await stream.close();
        return true;
      });
    },
  };
}

abstract class OPFSRepository {
  protected directory: string;

  async find() {
    return chainedStorage()
      .directory(this.directory)
      .keys();
  }

  async get(identifier: string) {
    const raw = await chainedStorage()
      .directory(this.directory)
      .get(identifier);
    if (raw instanceof Error) return raw;
    return JSON.parse(raw);
  }

  async put(identifier: string, subject) {
    return chainedStorage()
      .directory(this.directory)
      .put(identifier, Buffer.from(JSON.stringify(subject)));
  }

  async del(identifier: string) {
    return chainedStorage()
      .directory(this.directory)
      .del(identifier);
  }

}
