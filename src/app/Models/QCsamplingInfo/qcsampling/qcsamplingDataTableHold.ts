export class QcsamplingDataTableHold{
    docno !:string
    pddate !:string
    judgementQty !:number
    sub_table?: Sub[]
    btn !: boolean
  }

  export class Sub {
  
    time !:string
    hold_qty !:number
    cby !: string
    
  }