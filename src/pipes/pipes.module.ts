import { NgModule } from '@angular/core';
import { MydatePipe } from './mydate/mydate';
@NgModule({
	declarations: [MydatePipe],
	imports: [],
	exports: [MydatePipe]
})
export class PipesModule {

    static forRoot(){
        return {
            
            ngModule : PipesModule,
            providers: []
            
        }
    }
}
