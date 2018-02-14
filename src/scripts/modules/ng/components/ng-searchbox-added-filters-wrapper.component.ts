'use strict';

import {
  Component,
  ComponentFactoryResolver,
  AfterViewInit,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { NgSearchboxComponent } from './ng-searchbox.component';
import { NgSearchboxAddedFilter } from './ng-searchbox-added-filter.component';

import { FilteringService } from '../services/filtering.service';

import { Search } from '../../../interfaces/search';

@Component({

  'selector': 'ng-searchbox-added-filters-wrapper',

  'templateUrl': '../../../../views/modules/ng/components/ng-searchbox-added-filters-wrapper.component.pug',

  'styleUrls': ['../../../../styles/modules/ng/components/ng-searchbox-added-filters-wrapper.component.sass'],

  'entryComponents': [
    NgSearchboxAddedFilter
  ]

})

export class NgSearchboxAddedFiltersWrapper implements AfterViewInit {

  @ViewChild('ngSearchboxAddedFilters', { 'read': ViewContainerRef }) public ngSearchboxAddedFiltersViewContainer: ViewContainerRef;

  @ViewChild('ngSearchboxAddedFilters') public ngSearchboxAddedFilters: NgSearchboxAddedFiltersWrapper;

  @Input('observer') observer: EventEmitter<Search.BindingEventChange> = null;

  public Filtering: FilteringService = null;

  public searchbox: NgSearchboxComponent = null;

  constructor (
    public componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectionRef: ChangeDetectorRef
  ) {

    return this;

  }

  public ngAfterViewInit (): void {

    let self: NgSearchboxAddedFiltersWrapper = <NgSearchboxAddedFiltersWrapper>this;

    this
      .observer
      .subscribe((change: Search.BindingEventChange): void => {

        switch (change.name) {

          case Search.InformationChange:

            let data: Search.SearchBoxInformationExchange = <Search.SearchBoxInformationExchange>change.data;

            self.searchbox = data.component;

            if (self.searchbox) {

              self.Filtering = self
                .searchbox
                .Filtering;

            }

          break;

        }

        self
          .changeDetectionRef
          .detectChanges();

      });

  }

}