import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {

    transform(value: any, ...args: unknown[]): string {
        return (value.firstName+' '+value.lastName).toUpperCase();
    }

}
