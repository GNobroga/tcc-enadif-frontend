import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTruncate'
})
export class TextTruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 100, completeWords: boolean = false): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    let truncated = value.substr(0, limit);
    return truncated + '...';
  }
}
