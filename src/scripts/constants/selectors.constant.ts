'use strict';

import { Search } from '../interfaces/search';

export const NgSearchboxSelectors: Search.Selector[] = [
  {
    'name': 'Starts with',
    'key': 'startsWith',
    'selected': true
  },
  {
    'name': 'Contains',
    'key': 'contains',
    'notAllowed': [
      'restrictedSuggestedValues'
    ]
  },
  {
    'name': 'Does not contain',
    'key': 'doesNotContain',
    'notAllowed': [
      'restrictedSuggestedValues'
    ]
  },
  {
    'name': 'Is Equal To',
    'key': 'isEqualTo'
  },
  {
    'name': 'Is Not Equal To',
    'key': 'isNotEqualTo'
  },
  {
    'name': 'Ends with',
    'key': 'endsWith'
  },
  {
    'name': 'Similiarity',
    'key': 'similiarity'
  }
];
