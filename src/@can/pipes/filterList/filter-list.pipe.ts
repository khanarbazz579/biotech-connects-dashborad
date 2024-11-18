import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList'
})
export class CanFilterListPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((option) =>
      option.viewValue ? option.viewValue.toString().toLowerCase().indexOf(args.toLowerCase()) > -1 : option.toString().toLowerCase().indexOf(args.toLowerCase()) > -1
    );
  }

}
