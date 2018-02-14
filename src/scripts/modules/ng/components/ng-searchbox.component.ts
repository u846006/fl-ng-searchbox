'use strict';

import * as _ from 'lodash';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  Component,
  Input,
  Output,
  OnInit,
  AfterViewInit,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  Inject,
  ViewContainerRef,
  Compiler,
  Injector,
  NgModuleRef,
  NgModule,
  ComponentFactoryResolver, ComponentFactory
} from '@angular/core';

import { UtilsService } from '../services/utils.service';
import { EventHandling } from '../services/event-handling.service';
import { FilteringService } from '../services/filtering.service';
import { PlaceholdersService } from '../services/placeholders.service';
import { API } from '../services/api.service';

import { Search, ModifiedSearch } from '../../../interfaces/search';

import { NgSearchboxAddedFiltersWrapper } from './ng-searchbox-added-filters-wrapper.component';
import {ANGULAR_FACTORIES} from "../../../constants/angular.constant";

@Component({

  'selector': 'ng-searchbox',

  'templateUrl': '../../../../views/modules/ng/components/ng-searchbox.component.pug',

  'styleUrls': ['../../../../styles/modules/ng/components/ng-searchbox.component.sass']

})

export class NgSearchboxComponent implements OnInit, AfterViewInit {

  @ViewChild('ngSearchboxDclBottom', { read: ViewContainerRef }) public ngSearchboxDclBottom: ViewContainerRef;

  @ViewChild('ngSearchboxAddedFiltersWrapper') public ngSearchboxAddedFiltersWrapper: NgSearchboxAddedFiltersWrapper;

  @Input('searchParams') searchParams: Search.Parameters = null;

  @Input('ngSearchBoxFiltering') public ngSearchBoxFiltering: Search.AvailableFilter[] = null;

  @Input('ngSearchBoxConfig') public ngSearchBoxConfig: any = null;

  @Input('ngSearchBoxAutoComplete') public ngSearchBoxAutoComplete: any = null;

  @Input('ngSearchBoxCacheFilter') public ngSearchBoxCacheFilter: boolean = false;

  @Input('ngSearchBoxEnableFilterOperators') public ngSearchBoxEnableFilterOperators: boolean = false;

  @Input('ngSearchBoxFilterSelectors') public ngSearchBoxFilterSelectors: any = null;

  @Input('ngSearchBoxFilterOperators') public ngSearchBoxFilterOperators: any = null;

  @Input('ngSearchBoxDclAfter') public ngSearchBoxDclAfter: string[] = [];

  @Input('placeholder') public placeholder: string = '';

  @Output('onRegisterApi') onRegisterApi: EventEmitter<API> = new EventEmitter<API>();

  public onChange: EventEmitter<Search.BindingEventChange> = new EventEmitter<Search.BindingEventChange>();

  public Placeholding: PlaceholdersService = null;

  public Filtering: FilteringService = null;

  public Event: EventHandling = null;

  public Api: API = null;

  public query: string = '';

  public previousQuery: string = null;

  public hasQuery: boolean = false;

  public customParameters: any = {};

  public customParametersChanged: string[] = [];

  public sid: string = '';

  public defaultParams: Search.Parameters = {

    'query': '',

    'filters': [],

    'operators': []

  };

  constructor (
    public element: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private injector: Injector,
    private module: NgModuleRef<any>,
    public utils: UtilsService
  ) {

    return this;

  }

  public ngOnInit (): void {

    this.sid = this.utils.uuid();

    if (this.ngSearchBoxEnableFilterOperators) {

      this
        .defaultParams
        .operators = [];

    }

    this.configure();

  }

  public ngAfterViewInit (): void {

    let self: NgSearchboxComponent = <NgSearchboxComponent>this;

    this.Api = new API();

    this.Event = new EventHandling(self);

    this.Filtering = new FilteringService(self);

    this.Placeholding = new PlaceholdersService(self);

    self
      .Filtering
      .getPublisher()
      .subscribe((filters: ModifiedSearch.ModifiedFilter[]): void => {

        self
          .searchParams
          .filters = filters;

        self
          .Event
          .onChange(self.searchParams);

      });

    let searchBoxInformationExchange: Search.SearchBoxInformationExchange = {

      'component': self

    };

    self.emit(Search.InformationChange, searchBoxInformationExchange);

    self
      .constructDclAfterComponents()
      .register();

    self
      .changeDetectorRef
      .detectChanges();

  }

  private getFactoryEntry (type: string): any {

    let t: any = null;

    if (
      this.componentFactoryResolver &&
      this.componentFactoryResolver[ANGULAR_FACTORIES]
    ) {

      let factory: any = this.componentFactoryResolver[ANGULAR_FACTORIES];

      if (
        factory &&
        typeof factory.entries === 'function'
      ) {

        let entries: any[] = Array.from(factory.entries());

        _.forEach(entries, (entry: any[]): void => {

          let component: Function = entry[0];

          if (
            component &&
            component.name &&
            type === component.name
          ) {

            t = entry[1];

          }

        });

      }

    }

    return t;

  }

  private constructDclAfterComponents (): NgSearchboxComponent {

    let names: string[] = this.ngSearchBoxDclAfter;

    if (!_.isArray(names)) {

      names = [<any>this.ngSearchBoxDclAfter];

    }

    _.forEach(names, (name: string): void => {

      let factory: ComponentFactory<any> = this.getFactoryEntry(name);

      if (factory) {

        let cmpRef = factory.create(this.injector, [], null, this.module);

        this
          .ngSearchboxDclBottom
          .insert(cmpRef.hostView);

      }

    });

    return this;

  }

  public emit (name: string, data?: any): NgSearchboxComponent  {

    this
      .onChange
      .emit({

        'name': name,

        'data': data

      });

    return this;

  }

  public queryChange (val: string): void {

    let self: NgSearchboxComponent = <NgSearchboxComponent>this;

    if (
      !val &&
      !this.previousQuery &&
      typeof val === 'string' &&
      typeof this.previousQuery === 'string'
    ) {

        return;

    }

    if (typeof val !== 'undefined') {

      self.hasQuery = !!(val && val.length);

      self.searchParams.query = val;

      self
        .Event
        .onChange(self.searchParams)
        .onQueryAdded(val, this.previousQuery)
        .onQueryRemoved(val, this.previousQuery);

    }

  }

  public onKeyDown (event: any): void {

    this.previousQuery = event.target.value;

  }

  public configure (): NgSearchboxComponent {

    this.searchParams = this.defaultParams;

    return this;

  }

  public register (): NgSearchboxComponent {

    this
      .onRegisterApi
      .emit(this.Api);

    return this;

  }

  public eraseQuery (): void {

    this.previousQuery = null;

    this.query = '';

    this.queryChange(this.query);

  }

  public handleSearch (): void {

    this
      .Event
      .onChange(this.searchParams);

  }

  public handleEraser (): void {

    if (this.searchParams.query) {

      this.eraseQuery();

      this
        .Event
        .onEraser();


    }

  }

  public handleGarbage (): void {

    if (
      this.searchParams.query ||
      this.Filtering.hasFilters ||
      (this.customParametersChanged && this.customParametersChanged.length)
    ) {

      if (this.searchParams.query) {

        this.eraseQuery();
      }

      this.Filtering.removeAll();

      this.Event.onGarbage();

      _.forEach(this.customParametersChanged, (parameter: string): void => {

        if (
          this.customParameters &&
          this.customParameters[parameter]
        ) {

          if (typeof this.customParameters[parameter].defaultValue !== 'undefined') {

            this.searchParams[parameter] = this.customParameters[parameter].defaultValue || null;

          }

          if (typeof this.customParameters[parameter].reset === 'function') {

            this
              .customParameters[parameter]
              .reset();

          }

        } else {

          this.searchParams[parameter] = null;

        }

      });

      this.customParametersChanged = [];

      this
        .Event
        .onChange(this.searchParams);

    }

  }

  /**
   * @method addParameter
   * @param {string} name
   * @param options
   * @returns {NgSearchboxComponent}
   */

  public addParameter (name: string, options: any): NgSearchboxComponent {

    this.customParameters[name] = _.extend({

      'name': name

    }, options);

    if (options && typeof options.defaultValue !== 'undefined') {

      this.searchParams[name] = options.defaultValue || null;

    }

    return this;

  }

  public upsertParameter (name: string, data: any): NgSearchboxComponent {

    let self: NgSearchboxComponent = this;

    this.searchParams[name] = data;

    self
      .Event
      .onChange(
        self.searchParams,
        () => {

          self
            .customParametersChanged
            .push(name);

        }
      );

    return this;

  }

}