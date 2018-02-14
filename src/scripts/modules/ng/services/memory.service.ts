'use strict';

import { Injectable } from '@angular/core';

declare let window: Window;

@Injectable()
export class MemoryService {

  public static HASH: string = 'ng-searchbox';

  public storage: Storage = null;

  constructor () {

    this.storage = window.localStorage;

    return this;

  }

  public getAndSet (key: string, value?: string): void {

    if (!this.storage.getItem(MemoryService.HASH)) {

      this
        .storage
        .setItem(MemoryService.HASH, '{}');

    }

    let store = this.storage.getItem(MemoryService.HASH);

    if (store) {

      store = JSON.parse(store);

      if (typeof value === 'undefined') {

        return store[key];

      } else {

        store[key] = value;

        this
          .storage
          .setItem(
            MemoryService.HASH,
            JSON.stringify(store)
          );

      }

    }

  }

  public getAll (): any {

    let data: any = JSON.parse(this.storage.getItem(MemoryService.HASH));

    if (data) {

      delete data.cache;

      return data;

    }

    return {};

  }

  public removeAll (): any {

    let cache = this.getAndSet('cache'),

      obj: any = {};

    if (cache !== null) {

      obj.cache = cache;

    }

    this
      .storage
      .setItem(MemoryService.HASH, JSON.stringify(obj));

  }

}