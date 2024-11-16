import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentFullName'
})
export class StudentFullNamePipe implements PipeTransform {

    transform(value: any, ...args: unknown[]): string {
        return (value.firstName+' '+value.lastName).toUpperCase();
    }

}
