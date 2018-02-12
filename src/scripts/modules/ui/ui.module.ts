'use strict';

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgSearchboxComponent } from './components/ng-searchbox.component';
import { NgSearchboxAddedFilter } from './components/ng-searchbox-added-filter.component';
import { NgSearchboxAddedFiltersWrapper } from './components/ng-searchbox-added-filters-wrapper.component';
import { NgSearchboxFilteringComponent } from './components/ng-searchbox-filtering.component';
import { NgSearchboxFilterOperators } from './components/ng-searchbox-filter-operators.component';
import { NgSearchboxFilterSelectors } from './components/ng-searchbox-filter-selectors.component';

import { MemoryService } from './services/memory.service';
import { UtilsService } from './services/utils.service';

import './ui.font-awesome';

@NgModule({

  'imports': [
    CommonModule,
    FormsModule
  ],
  
  'declarations': [
    NgSearchboxComponent,
    NgSearchboxAddedFilter,
    NgSearchboxAddedFiltersWrapper,
    NgSearchboxFilterOperators,
    NgSearchboxFilterSelectors,
    NgSearchboxFilteringComponent
  ],

  'providers': [
    {

      'provide': Window,

      'useValue': window

    }, {

      'provide': Document,

      'useValue': document

    },
    MemoryService,
    UtilsService
  ],

  'exports': [
    NgSearchboxComponent
  ]

})

export class UiModule {}