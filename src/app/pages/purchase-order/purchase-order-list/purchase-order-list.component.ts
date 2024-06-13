import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order/purchase-order.service';
import { ExportServiceService } from 'src/app/shared/services/utility/export-service.service';
import { saveAs } from 'file-saver'; 
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  constructor(private purchaseOrderService : PurchaseOrderService,
     private exportServiceService : ExportServiceService,
     private notification: NzNotificationService,
     private modal: NzModalService,
     private router: Router) { }

  allChecked: boolean = false;
  indeterminate: boolean = false;
  displayData = [];
  searchInput: string
  showDeleteAlert = false; 
  selectedPurchaseOrderId: number; 



   total = 0;
   pageSize = 10;
   pageIndex = 1;

  ngOnInit(): void {
    this.getPurchaseOrderList()
  }


  orderColumn = [
    { title: 'REF.ID' },
    { title: 'PO NO' },
    { title: 'PO DATE' },
    { title: 'SUPPLIER' },
    { title: 'EX.DATE' },
    { title: 'EDIT' },
    { title: 'DELETE' },
    { title: 'EXPORT' }
  ];

  getPurchaseOrderList(): void {
    this.purchaseOrderService.getPurchaseOrderList(this.pageIndex, this.pageSize, this.searchInput)
      .subscribe(response => {
        console.log(response);
        this.displayData = response.data;
        if (response.pagination) {
          this.total = response.pagination.TotalCount;
        } else {
          this.total = 0; 
        }
      }, error => {
        console.error('Error fetching purchase orders:', error);
        this.total = 0;
      });
  }




onPageIndexChange(pageIndex: number): void {
  this.pageIndex = pageIndex;
  this.getPurchaseOrderList();
}

onPageSizeChange(pageSize: number): void {
  this.pageSize = pageSize;
  this.pageIndex = 1; // Reset to first page
  this.getPurchaseOrderList();
}

search(): void {
  debugger;
  this.pageIndex = 1;
  this.getPurchaseOrderList();
}

exportPDF(purchaseOrderId: number): void {
  this.exportServiceService.exportPDF(purchaseOrderId).subscribe(response => {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    saveAs(blob, 'PurchaseOrderReport.pdf');
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Error exporting PDF:', error);
  });
}


deletePurchaseOrder(purchaseOrderId: number) {
  debugger;
  this.selectedPurchaseOrderId = purchaseOrderId;
  this.showDeleteConfirmation();
}

editPurchaseOrder(purchaseOrderId: number){
  debugger;
  this.selectedPurchaseOrderId = purchaseOrderId;
  this.router.navigate(['/pages/purchase-order-edit', this.selectedPurchaseOrderId]);
}

showDeleteConfirmation(): void {
  this.modal.confirm({
    nzTitle: 'Delete Confirmation',
    nzContent: 'Are you sure you want to delete this purchase order? This action cannot be undone.',
    nzOnOk: () => this.confirmDelete(),
    nzOnCancel: () => this.cancelDelete()
  });
}

confirmDelete() {
  this.purchaseOrderService.deletePurchaseOrder(this.selectedPurchaseOrderId).subscribe(response => {
    this.notification.success('Success', 'Purchase order deleted successfully.');
    this.getPurchaseOrderList();
    this.showDeleteAlert = false; // Hide the delete confirmation alert after successful deletion
  }, error => {
    console.error('Error deleting purchase order:', error);
   this.notification.error('Error', 'Error deleting purchase order:'+error); 
  });
}

cancelDelete() {
  this.showDeleteAlert = false; // Hide the delete confirmation alert if the user cancels deletion
}

onClickCreateButton(){
  this.router.navigate(['/pages/purchase-order-create']);
}


}
