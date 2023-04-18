export class LineProcessInfoModule{

    main!:string;
    sub!:string;
    std!:string;
    act!:number;

  
  }


  export class MainProcessInfoModule {
    main_line_process !:string
  }


  export class SubProcessInfoModule {
    sub_line_process !:string
    sub_std !: string
  }


  export class DataTableSubLineProcessModule {
    sub_line !: string
    std !: string
    act !: number
  }



  export class DataTableLineProcessModule {
    main_line !: string
    sub_line : DataTableSubLineProcessModule[] | undefined ;
 
  }

