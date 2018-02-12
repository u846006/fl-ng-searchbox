'use strict';

import { Search } from '../interfaces/search';

export const OPERATORS: Search.Operator[] = [
  {
    'name': 'AND',
    'selected': true
  }, {
    'name': 'OR'
  }, {
    'name': 'NOR'
  }, {
    'name': 'NOT'
  }
];