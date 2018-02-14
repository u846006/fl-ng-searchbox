'use strict';

import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import { Search } from '../../../interfaces/search';

import { SearchboxEvent } from '../../../constants/events.constant';

@Injectable()
export class API {

  public $$registeredEvents: Search.RegisteredEvent[] = <Search.RegisteredEvent[]>[];

  constructor () {

    return this;

  }

  /**
   * @method on
   * Add event listener to our search box
   * @param {string} type
   * @param {Function} fn
   * @returns {API}
   */

  public on (type: string, fn: Function): API {

    let self: API = <API>this,

      isRegisteredAlready: boolean = false;

    this
      .hasEventErrors(type, fn)
      .hasInvalidEventType(type);

    this
      .$$registeredEvents
      .forEach((event: any): void => {

        if (
          event &&
          event.fn === fn &&
          event.type === type
        ) {

          isRegisteredAlready = true;

        }

      });

    if (!isRegisteredAlready) {

      self
        .$$registeredEvents
        .push({

          'type': type,

          'fn': fn

        });

    }

    return this;

  }

  /**
   * @method off
   * Remove event listener from our search box
   * @param {string} type
   * @param {Function} fn
   * @returns {API}
   */

  public off (type: string, fn: Function): API {

    let self: API = <API>this,

      isFnEmpty: boolean = false;

    this
      .hasEventErrors(type, fn, true)
      .hasInvalidEventType(type);

    if (typeof fn !== 'function') {

      isFnEmpty = true;

    }

    self
      .$$registeredEvents
      .slice()
      .reverse()
      .forEach((
        addedEvent: Search.RegisteredEvent,
        addedIndex: number,
        addedObject: any
      ): void => {

        if (
          (addedEvent && addedEvent.fn === fn && addedEvent.type === type) ||
          (isFnEmpty && addedEvent && addedEvent.type === type)
        ) {

          self
            .$$registeredEvents
            .splice(addedObject.length - 1 - addedIndex, 1);

        }

      });

    return this;

  }

  /**
   * @method offAll
   * Remove all event listeners attached to our search box
   * @returns {API}
   */

  public offAll (): API {

    let self: API = <API>this;

    self
      .$$registeredEvents
      .slice()
      .reverse()
      .forEach((
        addedEvent: Search.RegisteredEvent,
        addedIndex: number,
        addedObject: any
      ): void => {

        self
          .$$registeredEvents
          .splice(addedObject.length - 1 - addedIndex, 1);

      });

    return this;

  }

  private hasEventErrors (
    evt: string,
    fn: Function,
    emptyFnAllowed: boolean = false
  ): API {

    if (typeof evt !== 'string') {

      throw new TypeError('NgSearchbox API - Event Name parameter must be type String!');

    }

    if (typeof fn !== 'function' && !emptyFnAllowed) {

      throw new TypeError('NgSearchbox API - Event Function parameter must be type Function!');

    }

    return this;

  }

  private hasInvalidEventType (evt: string): API {

    let validType: boolean = false,

      names: string[] = Object.keys(SearchboxEvent),

      types: string[] = [];

    _.map(names, (name: string): void => {

      types.push(SearchboxEvent[name]);

    });

    types.forEach((type: string): void => {

      type = type.toLowerCase();

      evt = evt.toLowerCase();

      if (type === evt) {

        validType = true;

      }

    });

    if (!validType) {

      throw new ReferenceError('NgSearchbox API - Invalid Event Type Provided!');

    }

    return this;

  }

}