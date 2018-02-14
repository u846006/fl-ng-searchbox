/**
 * @note This module is specifically for usage with demo;
 * doesn't provide any functionality towards the searchbox.
 */


'use strict';

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSearchboxModule } from '../ng/ng-searchbox.module';

import { AppComponent } from './components/app.component';
import { TestComponent } from './components/test.component';

@NgModule({

  'imports': [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSearchboxModule
  ],

  'declarations': [
    AppComponent,
    TestComponent
  ],

  'providers': [],

  'bootstrap': [AppComponent],

  'entryComponents': [
    TestComponent
  ]

})

export class DemoModule {}