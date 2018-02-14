'use strict';

import {
  Component,
  Input,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  NgZone,
  HostListener
} from '@angular/core';

import { NgSearchboxComponent } from './ng-searchbox.component';

import { Search, ModifiedSearch } from '../../../interfaces/search';

import { FilteringService } from '../services/filtering.service';
import { UtilsService } from '../services/utils.service';

@Component({

  'selector': 'ng-searchbox-filtering',

  'templateUrl': '../../../../views/modules/ng/components/ng-searchbox-filtering.component.pug',

  'styleUrls': ['../../../../styles/modules/ng/components/ng-searchbox-filtering.component.sass']

})

export class NgSearchboxFilteringComponent implements AfterViewInit {

  @ViewChild('ngSearchboxFilteringList') public ngSearchboxFilteringList: ElementRef;

  @Input('observer') public observer: EventEmitter<Search.BindingEventChange> = null;

  public Filtering: FilteringService = null;

  public availableFilters: Search.AvailableFilter[];

  public active: boolean = false;

  public searchbox: NgSearchboxComponent = null;

  private proxiedFunction: EventListenerOrEventListenerObject;

  constructor (
    private changeDetectionRef: ChangeDetectorRef,
    private utils: UtilsService,
    private zone: NgZone
  ) {

    return this;

  }

  @HostListener('window:resize', ['$event'])
  private handleResize (): void {

    if (this.active) {

      this.setPosition();

    }

  }

  public toggleFilters (active?: boolean) {

    let self: NgSearchboxFilteringComponent = <NgSearchboxFilteringComponent>this;

    if (typeof active !== 'undefined') {

      this.active = active;

    } else {

      this.active = !this.active;

    }

    this
      .zone
      .run((): void => {

        if (self.active) {

          self.setPosition();

        }

    });

  }

  public setPosition (): void {

    let el: ElementRef = this.searchbox.element,

      list: HTMLElement = (<HTMLElement>this.ngSearchboxFilteringList.nativeElement),

      h: number = this.utils.getHeightOf(el);

    list.style.top = h + 'px';

  }

  public ngAfterViewInit (): void {

    let self: NgSearchboxFilteringComponent = <NgSearchboxFilteringComponent>this;

    this
      .observer
      .subscribe((change: Search.BindingEventChange): void => {

        switch (change.name) {

          case Search.InformationChange:

            let data: Search.SearchBoxInformationExchange = <Search.SearchBoxInformationExchange>change.data;

            self.searchbox = data.component;

            if (self.searchbox) {

              self.availableFilters = this.excludeFromFilters(
                self
                  .searchbox
                  .ngSearchBoxFiltering
              );

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

  public excludeFromFilters (filters: Search.AvailableFilter[]):  Search.AvailableFilter[] {

    let excludedFilters: Search.AvailableFilter[] = JSON.parse(
      JSON.stringify(
        filters
      )
    );

    excludedFilters
      .slice()
      .reverse()
      .forEach((
        filter: Search.AvailableFilter,
        filterIndex: number,
        filterObject: any
      ): void => {

        if(filter.excluded) {

          excludedFilters
            .splice(
              filterObject.length - 1 - filterIndex,
              1
            );

        }

      });

    return excludedFilters;

  }

  public addFilterAndClose (filter: ModifiedSearch.ModifiedFilter): void {

    this.toggleFilters(false);

    this
      .Filtering
      .add(filter);

    return

  }

  public addFilter (event: MouseEvent, name: string): void {

    let self: NgSearchboxFilteringComponent = <NgSearchboxFilteringComponent>this;

    if (this.availableFilters) {

      this
        .availableFilters
        .forEach((filter: Search.AvailableFilter): void => {

          let modifiedFilter: ModifiedSearch.ModifiedFilter = <ModifiedSearch.ModifiedFilter>filter;

          if (modifiedFilter.name === name) {

            if(modifiedFilter.restrictedSuggestedValues) {

              self.addFilterAndClose(modifiedFilter);

            } else {

              if(!modifiedFilter.multi) {

                modifiedFilter.notFiltered = !modifiedFilter.notFiltered;

                if(!modifiedFilter.notFiltered) {

                  self.addFilterAndClose(modifiedFilter);

                }

              } else {

                self.addFilterAndClose(modifiedFilter);

              }

            }

          }

        });

    }

  }

}