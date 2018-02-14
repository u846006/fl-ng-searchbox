'use strict';

import { Injectable, EventEmitter } from '@angular/core';

import { ModifiedSearch, Search } from '../../../interfaces/search';

import {NgSearchboxComponent} from '../components/ng-searchbox.component';

import { SearchboxEvent } from '../../../constants/events.constant';

@Injectable()
export class EventHandling {

  public emitter: EventEmitter<any>;

  public timer: any = null;

  constructor (
    private ngSearchBoxComponent: NgSearchboxComponent
  ) {

    return this;

  }

  public init (): EventHandling {

    this.emitter = new EventEmitter<any>();

    return this;

  }

  public fire (type: string, data?: any): EventHandling {

    let ev = {

      '$$lastChange': new Date().getTime()

    };

    type = type.toLowerCase();

    this
      .ngSearchBoxComponent
      .Api
      .$$registeredEvents
      .forEach((event: any): void => {

        if (event && event.type) {

          event.type = event.type.toLowerCase();

          if (
            event.type === type &&
            typeof event.fn === 'function'
          ) {

              event.fn(ev, data);

          }

        }

      });

    return this;

  }

  public onChange (parameters: any, invocation: Function = null): EventHandling {

    if (
      !invocation ||
      typeof invocation !== 'function'
    ) {

      invocation = function () {};

    }

    if (this.timer) {

      this
        .ngSearchBoxComponent
        .window
        .clearTimeout(this.timer);

      this.timer = null;

    }

    if (
      this.ngSearchBoxComponent.ngSearchBoxConfig &&
      this.ngSearchBoxComponent.ngSearchBoxConfig.delay
    ) {

      this.timer = this
        .ngSearchBoxComponent
        .window
        .setTimeout((): void => {

          invocation();

          this.fire(SearchboxEvent.ON_CHANGE, parameters);

        }, this.ngSearchBoxComponent.ngSearchBoxConfig.delay);

    } else {

      invocation();

      this.fire(SearchboxEvent.ON_CHANGE, parameters);

    }

    return this;

  }

  public onQueryAdded (n: string, o: string): EventHandling {

    if (
      o === null ||
      typeof o === 'undefined' ||
      (typeof o !== 'undefined' && !o.length)
    ) {

      if (n && n.length) {

        this.fire('onQueryAdded', n);

      }

    }

    return this;

  }

  public onQueryRemoved (n: string, o: string): EventHandling {

    if (
      o === null ||
      typeof o !== 'undefined' && o && o.length
    ) {

      if (
        !n ||
        (typeof n === 'string' && !n.length)
      ) {

        this.fire('onQueryRemoved', n);

      }

    }

    return this;

  }

  public onEraser (): EventHandling {

    this.fire('onEraser');

    return this;

  }

  public onGarbage (): EventHandling {

    this.fire('onGarbage');

    return this;

  }

  public onFilterChanged (filter: ModifiedSearch.ModifiedFilter): EventHandling {

    this.fire('onFilterChanged', filter);

    return this;

  }

  public onFilterSelectorChanged (selector: Search.Selector, filter: ModifiedSearch.ModifiedFilter): EventHandling {

    let opts = {

      'selector': selector,

      'filter': filter

    };

    this.fire('onFilterSelectorChanged', opts);

    return this;

  }

  public onOperatorChanged (operator: Search.Operator, filter: ModifiedSearch.ModifiedFilter): EventHandling {

    let opts = {

      'name': operator ? operator.name : '',

      'filter': filter

    };

    this.fire('onOperatorChanged', opts);

    return this;

  }

}