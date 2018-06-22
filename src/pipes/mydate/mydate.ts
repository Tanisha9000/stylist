import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
/**
 * Generated class for the MydatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'mydate',
})
export class MydatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
            console.log(value);
    return moment(value).fromNow();
    //return value.toLowerCase();
  }
}
