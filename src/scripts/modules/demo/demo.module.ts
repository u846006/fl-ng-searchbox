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

import { UiModule } from '../ui/ui.module';

import { AppComponent } from './components/app.component';

@NgModule({

  'imports': [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ],

  'declarations': [
    AppComponent
  ],

  'providers': [],

  'bootstrap': [AppComponent]

})

export class DemoModule {}