'use strict';

import { ComponentRef } from '@angular/core';

import { NgSearchboxComponent } from '../modules/ng/components/ng-searchbox.component';
import { NgSearchboxFilterOperators } from '../modules/ng/components/ng-searchbox-filter-operators.component';
import { NgSearchboxAddedFilter } from '../modules/ng/components/ng-searchbox-added-filter.component';

export namespace Search {

  export const InformationChange: string = 'informationChange';

  export interface BindingEventChange {

    name: string;

    data: any;

  }

  export interface SearchBoxInformationExchange {

    component?: NgSearchboxComponent;

  }

  export interface Selector {

    name?: string;

    key?: string;

    selected?: boolean;

    notAllowed?: string[];

  }

  export interface Operator {

    name?: string;

    selected?: boolean;

  }

  export interface RemoveOptions {

    update?: boolean;

  }

  export interface Configuration {

    delay?: number;

    placeholders?: string[];

    placeholderInterval?: number;

    placeholderSpeedOutInterval?: number;

    placeholderSpeedInInterval?: number;

    store?: boolean;

    updateOnlyByEnterKey?: boolean;

    autoCompleteUrl?: string;

  }

  export interface SelectedFilter {

    name?: string;

    value?: string;

    isAllowedEmptyValue?: boolean;

    hideWhenAdded?: boolean;

  }

  export interface AvailableFilter {

    name: string;

    displayName?: string;

    excluded?: boolean;

    middleware?: (Function|Function[]);

    multi?: boolean;

    validation?: string;

    suggestedValues?: (string|string[]);

    suggestedDataPoint?: string;

    restrictedSuggestedValues?: boolean;

    reloadOnCreate?: boolean;

    root?: string;

    child?: string;

  }

  export interface Filter {

    condition: string;

    value: string;

    name: string;

    $$timestamp?: number;

    $$modified?: number;

    $$lastValue?: string;

  }

  export interface Parameters {

    query: string;

    filters: ModifiedSearch.ModifiedFilter[];

    operators?: string[];

  }

  export interface RegisteredEvent {

    type: string;

    fn: Function;

  }

}

export namespace ModifiedSearch {

  export interface ModifiedFilter extends Search.AvailableFilter {

    $$lastValue?: string;

    $$timestamp?: number;

    $$modified?: number;

    $$operator?: string;

    notFiltered?: boolean;

    active?: boolean;

    value?: string;

    editing?: boolean;

    uuid?: string;

    condition?: string;

    selector?: Search.Selector;

    operator?: Search.Operator;

    /**
     * @property isAllowedEmptyValue
     * @default false
     * defaults to false
     */

    isAllowedEmptyValue?: boolean;

    /**
     * @property hideWhenAdded
     * @default false
     * Hide this filter when initially added
     */

    hideWhenAdded?: boolean;

  }

}

export interface AddedFilter {

  component: ComponentRef<NgSearchboxAddedFilter>;

  operator?: NgSearchboxFilterOperators;

  filter: ModifiedSearch.ModifiedFilter;

}
