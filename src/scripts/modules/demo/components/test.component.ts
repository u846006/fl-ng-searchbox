'use strict';

import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Inject,
  OnInit
} from '@angular/core';

import { NgSearchboxComponent } from '../../ng/components/ng-searchbox.component';

@Component({

  'selector': 'test-component',

  'templateUrl': '../../../../views/modules/demo/components/test.component.pug',

  'styleUrls': ['../../../../styles/modules/demo/components/test.component.sass']

})

export class TestComponent implements OnInit {

  public static DEFAULT_OPTION: string = '1';

  public static PARAMETER: string = 'option';

  public searchOption: string = TestComponent.DEFAULT_OPTION;

  constructor (
    @Inject(forwardRef(() => NgSearchboxComponent)) public ngSearchBoxComponent: NgSearchboxComponent,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    return this;

  }

  public ngOnInit (): void {

    this
      .ngSearchBoxComponent
      .addParameter(TestComponent.PARAMETER, {

        'defaultValue': this.searchOption,

        'reset': this.reset.bind(this)

      });

  }

  private reset (): void {

    console.log('double check...');

    this.searchOption = TestComponent.DEFAULT_OPTION;

    this
      .changeDetectorRef
      .detectChanges();

  }

  public change (text: string): void {

    this
      .ngSearchBoxComponent
      .upsertParameter(TestComponent.PARAMETER, text);

  }
  
}