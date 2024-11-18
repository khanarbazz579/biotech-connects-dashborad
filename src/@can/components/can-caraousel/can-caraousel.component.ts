import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CanImage } from 'src/@can/types/image.type';

@Component({
  selector: 'can-caraousel',
  templateUrl: './can-caraousel.component.html',
  styleUrls: ['./can-caraousel.component.scss']
})
export class CanCaraouselComponent implements OnInit, AfterViewChecked {
  @Input() public imagesData: CanImage[];

  @Input() currentIndex: number = 0;

  @ViewChild('carousel', { static: false }) private carousel: ElementRef;
  private itemWidth: number;

  constructor() { }

  ngOnInit() { }

  ngAfterViewChecked() {
    // Get Item width
    this.itemWidth = this.carousel.nativeElement.getBoundingClientRect().width;

    // Check for carousel element
    if (this.carousel && this.carousel.nativeElement) {
      // Calculate offset
      const offset = this.currentIndex * this.itemWidth;
      // Apply offset to style
      this.carousel.nativeElement.style.transform = `translateX(-${offset}px)`;
    }
  }

  /**
   * Next Button clicked
   */
  public next() {
    // Check whether current index is last or not
    if (this.currentIndex + 1 === this.imagesData.length) {
      return;
    };
    // Increment currentIndex
    this.currentIndex = this.currentIndex + 1;
    // Calculate offset
    const offset = this.currentIndex * this.itemWidth;
    // Apply offset to style
    this.carousel.nativeElement.style.transform = `translateX(-${offset}px)`;
  }

  /**
   * Previous Button clicked
   */
  public previous() {
    // Check for first image
    if (this.currentIndex === 0) {
      return;
    }
    // Decrement currentIndex
    this.currentIndex = this.currentIndex - 1;
    // Calculate offset
    const offset = this.currentIndex * this.itemWidth;
    // Apply offset to style
    this.carousel.nativeElement.style.transform = `translateX(-${offset}px)`;
  }
}
