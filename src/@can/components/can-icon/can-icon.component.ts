import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CanIcon, CanIconType } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-icon',
  templateUrl: './can-icon.component.html',
  styleUrls: ['./can-icon.component.scss']
})
export class CanIconComponent implements OnInit, AfterViewInit {
  // Icon element for changing css
  @ViewChild('iconContent', { static: false }) iconContent: ElementRef;

  @Input() iconConfig: CanIcon;

  CanIconType = CanIconType;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.iconConfig && this.iconConfig.color && this.iconContent) {
      this.iconContent.nativeElement.style.color = this.iconConfig.color;
    } else {
      this.iconContent.nativeElement.style.color = '#212121';
    }

  }

}
