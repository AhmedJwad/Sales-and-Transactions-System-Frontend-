import type { GridColDef } from '@mui/x-data-grid';

export interface IDatagrid {
    columns:GridColDef[],
    rows:any[],
   title:string,
   filtercolumn:string[],
}