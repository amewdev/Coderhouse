import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFontsize20]'
})

export class Fontsize20Directive {

    constructor(private el: ElementRef<HTMLElement>) {
        this.applySize();
    }

    applySize(): void {
        this.el.nativeElement.style.fontSize = "20px";
    }

}
