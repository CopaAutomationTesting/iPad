import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'objtoarray'
})

export class ArraysPipe implements PipeTransform {
  transform(value) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}



@Pipe({name: 'values'})

export class ValuesPipe implements PipeTransform {
    transform(value: any, args?: any[]): any[] {
        // create instance vars to store keys and final output
        console.log("sdsds"+ value);
        let keyArr: any[] = Object.keys(value),
            dataArr = [];

        // loop through the object,
        // pushing values to the return array
        keyArr.forEach((key: any) => {
            dataArr.push(value[key]);
        });

        // return the resulting array
        return dataArr;
    }
}

@Pipe({
    name: "datafilter",
    pure: false
})
export class ArrayFilterPipe implements PipeTransform {
 
    transform(items: Array<any>, conditions: {[field: string]: any}): Array<any> {
        return items.filter(item => {
            for (let field in conditions) {
                if (item[field] !== conditions[field]) {
                    return false;
                }
            }
            return true;
        });
    }
}


