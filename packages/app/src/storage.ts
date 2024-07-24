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
function chainedStorage(path?: ChainedStorageEntry[]) {
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

abstract class GenericRepository {
  protected directory: string;

  // private async buildDirectoryHandle(path: string|string[]) {
  //   if (Array.isArray(path)) {
  //     path = path.join('/');
  //   }
  //   if ('string' === typeof path) {
  //     path = path.replace(/(^\/+|\/+$)/, '').split('/');
  //   }
  //   if (!Array.isArray(path)) {
  //     return new Error('Invalid path');
  //   }
  //   let handle = await navigator.storage.getDirectory();
  //   while(path.length) {
  //     handle = await handle.getDirectoryHandle(path.shift(), { create: true });
  //   }
  //   return handle;
  // }

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

  // async get(identifier: string, create?: boolean = false) {
  //   const dirHandle = await this.buildDirectoryHandle(this.directory);
  //   try {
  //     const fileHandle = await dirHandle.getFileHandle(identifier, { create });
  //     return fileHandle;
  //   } catch {
  //     return new NotFoundError();
  //   }
  // }

  // async delete(identifier: string) {
  //   const dirHandle = await this.buildDirectoryHandle(this.directory);
  //   try {
  //     dirHandle.removeEntry(identifier, { recursive: true });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

}

class ProfileRepository extends GenericRepository {
  constructor() {
    super();
    this.directory = 'profiles';
  }
}

class SessionRepository extends GenericRepository {
  constructor() {
    super();
    this.directory = 'sessions';
  }
}

export const sessionRepository = new SessionRepository();
export const profileRepository = new ProfileRepository();
