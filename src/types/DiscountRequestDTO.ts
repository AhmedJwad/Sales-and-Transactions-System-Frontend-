

export interface DiscountRequestDTO {
    Id:number;
    DiscountPercent:number;
    StartTime: string,
    Endtime: string,
    isActive: boolean,
    ProductIds: number[],
}