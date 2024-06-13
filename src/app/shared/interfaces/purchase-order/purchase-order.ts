export interface PurchaseOrder {
    purchaseOrderId: number;
    referenceId: number;
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    supplierId: number;
    expectedDate: Date;
    remarks: string;
    purchaseOrderDetails: PurchaseOrderDetail[];
  }
  
  export interface PurchaseOrderDetail {
    purchaseOrderDetailId: number;
    purchaseOrderId: number;
    lineItemId: number;
    quantity: number;
    rate: number;
    lineItemName? : string;
  }
  
  export interface PurchaseOrderWithDetailsCreationDto {
    purchaseOrder: PurchaseOrder;
    purchaseOrderDetails: PurchaseOrderDetail[];
  }

  export interface PurchaseOrderForEditDto {
    purchaseOrderId: number;
    referenceId: number;
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    supplierId: number;
    expectedDate: Date;
    remarks: string;
    purchaseOrderDetailForEditDtos: PurchaseOrderDetailForEditDto[];
  }
  

  export interface PurchaseOrderDetailForEditDto {
    purchaseOrderDetailId: number;
    purchaseOrderId: number;
    lineItemId: number;
    quantity: number;
    rate: number;
    lineItemName : string;
  }



export interface PurchaseOrderUpdateDto {
  purchaseOrderId: number;
  referenceId: number;
  purchaseOrderNumber: string;
  purchaseOrderDate: Date;
  supplierId: number;
  expectedDate: Date;
  remarks: string;
}

export interface PurchaseOrderDetailUpdateDto {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  lineItemId: number;
  quantity: number;
  rate: number;
}

export interface PurchaseOrderWithDetailsUpdateDto {
  purchaseOrder: PurchaseOrderUpdateDto;
  purchaseOrderDetails: PurchaseOrderDetailUpdateDto[];
}
