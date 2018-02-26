'use strict';

import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import {ModifiedSearch, Search} from '../../../interfaces/search';

import { NgSearchboxEvent } from '../../../constants/events.constant';

import { NgSearchboxComponent } from '../components/ng-searchbox.component';

@Injectable()
export class API {

  public $$registeredEvents: Search.RegisteredEvent[] = <Search.RegisteredEvent[]>[];

  constructor (
    private ngSearchBoxComponent: NgSearchboxComponent
  ) {

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

  public addFilterToMenu (filter: Search.SelectedFilter|Search.AvailableFilter[]): API {

    let filters = [];

    if (_.isArray(filter)) {

      filters = <any[]>filter;

    } else {

      filters = [filter];

    }

    filters.forEach((item: Search.AvailableFilter): void => {

      this
        .ngSearchBoxComponent
        .ngSearchboxFilteringComponent
        .addToFilterList(item);

    });

    return this;

  }

  public removeFilterFromMenu (filter: string|string[]|Search.AvailableFilter|Search.AvailableFilter[]): API {

    let filters = [];

    if (_.isArray(filter)) {

      filters = <any[]>filter;

    } else {

      filters = [filter];

    }

    filters.forEach((item: string|Search.AvailableFilter): void => {

      this
        .ngSearchBoxComponent
        .ngSearchboxFilteringComponent
        .removeFromFilterList(item);

      this
        .ngSearchBoxComponent
        .Filtering
        .removeByFilterType(item);

    });

    return this;

  }

  /**
   * @method addFilter
   * Add filters automatically to selected filters
   * @returns {API}
   */

  public addFilter (filter: string|string[]|Search.SelectedFilter|Search.SelectedFilter[]): API {

    let filters = [];

    if (_.isArray(filter)) {

      filters = <any[]>filter;

    } else {

      filters = [filter];

    }

    filters.forEach((item: string|Search.SelectedFilter): void => {

      let f: Search.SelectedFilter = {};

      if (typeof item === 'string') {

        f.name = item;

      } else {

        f = item;

      }

      if (f.name) {

        let availableFilters: Search.AvailableFilter[] = this.ngSearchBoxComponent.ngSearchboxFilteringComponent.getAvailableFilters,

          foundFilter: Search.AvailableFilter = _.find(availableFilters, { 'name': f.name });

        if (foundFilter) {

          f.isAllowedEmptyValue = true;

          f.hideWhenAdded = true;

          if (!f.value) {

            f.value = '';

          }

          setTimeout(() => {

            this
              .ngSearchBoxComponent
              .Filtering
              .add(foundFilter, f);

          });

        }

      } else {

        throw new Error('NgSearchbox API - Missing \'name\' key!');

      }

    });

    return this;

  }

  /**
   * @method setQuery
   * Automatically set query via API
   * @param {string} query
   * @param {boolean} fire
   */

  public setQuery (query: string, fire: boolean = true): void {

    this
      .ngSearchBoxComponent
      .query = query;

    this
      .ngSearchBoxComponent
      .queryChange(query, fire)

  }

  public getFilters (): Search.AvailableFilter[] {

    return this
      .ngSearchBoxComponent
      .ngSearchboxFilteringComponent
      .getAvailableFilters;

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

      names: string[] = Object.keys(NgSearchboxEvent),

      types: string[] = [];

    _.map(names, (name: string): void => {

      types.push(NgSearchboxEvent[name]);

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
