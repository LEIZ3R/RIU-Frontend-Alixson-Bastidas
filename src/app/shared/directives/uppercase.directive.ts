import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    this.toUpperCase();
  }

  @HostListener('blur') onBlur() {
    this.toUpperCase();
  }

  private toUpperCase() {
    if (!this.control.control) return;

    const value = this.control.control.value;
    if (value && typeof value === 'string') {
      const upperValue = value.toUpperCase();
      this.control.control.setValue(upperValue, { emitEvent: false });
      this.el.nativeElement.value = upperValue;
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const target = this.el.nativeElement;
    const startPos = target.selectionStart;
    const endPos = target.selectionEnd;
    const currentValue = target.value;
    target.value =
      currentValue.substring(0, startPos) +
      pastedText.toUpperCase() +
      currentValue.substring(endPos);

    this.control.control?.setValue(target.value, { emitEvent: false });
    const newCursorPos = startPos + pastedText.length;
    target.setSelectionRange(newCursorPos, newCursorPos);
  }
}
