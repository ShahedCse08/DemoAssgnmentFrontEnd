import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { PurchaseOrder, PurchaseOrderDetail, PurchaseOrderWithDetailsCreationDto } from 'src/app/shared/interfaces/purchase-order/purchase-order';
import { DropdownItem } from 'src/app/shared/interfaces/utility/dropdown';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order/purchase-order.service';
import { AutocompleteService } from 'src/app/shared/services/utility/autocomplete.service';
import { DropdownService } from 'src/app/shared/services/utility/dropdown.service';


@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css']
})
export class PurchaseOrderCreateComponent implements OnInit {
  purchaseOrderForm: FormGroup;
  purchaseOrderDetailForm : FormGroup
  items: any[] = [];
  size: NzButtonSize = 'large';
  autocompleteSuggestions$: Observable<any[]>;
  mappedSuggestions: any[];
  inputValue: string; 
  lineItems: DropdownItem<number>[] = [];
  suppliers: DropdownItem<number>[] = [];
  activeIndex? : number = null
  
  constructor(
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private autocompleteService: AutocompleteService,
    private dropDownService : DropdownService,
    private modal: NzModalService,
    private router: Router,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.initializeMasterForm();
    this.initializeDetailForm();
    this.getLineItemsDropDown();
    this.getSuppliersDropDown();
  }

initializeMasterForm(){

  this.purchaseOrderForm = this.fb.group({
    referenceId: [null, [Validators.required, Validators.min(1)]], 
    purchaseOrderDate: [null, Validators.required],
    expectedDate: [null, Validators.required],
    purchaseOrderNumber: ['', Validators.required],
    supplier: [null, Validators.required],
    remarks: [''],
  });

}

name = "";
mynumber : any;

format() {
  debugger;
  const formValues = this.purchaseOrderForm.value;
  formValues.referenceId = this.padLeft( formValues.referenceId, "0", 2);
}

padLeft(text: string, padChar: string, size: number): string {
  return (String(padChar).repeat(size) + text).substr(size * -1, size);
}

initializeDetailForm(): void {
  this.purchaseOrderDetailForm = this.fb.group({
    lineItem: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]], 
    rate: [null, [Validators.required, Validators.min(1)]] 
  });
}

getLineItemsDropDown (){
  debugger;
  const keyword = this.inputValue ? this.inputValue : '';
  this.autocompleteService.getLineItems(keyword).subscribe(data => {
      this.lineItems = data;
    });
 }

 getSuppliersDropDown (){
  this.dropDownService.getSuppliersDropdown().subscribe(data => {
      this.suppliers = data;
    });
 }

 onInput(value: string) {
    this.inputValue = value;
    this.getLineItemsDropDown();
  }

  getSelectedText(): string {
    const selectedValue = this.purchaseOrderDetailForm.value.lineItem;
    const selectedItem = this.lineItems.find(item => item.value === selectedValue);
    if (selectedItem) {
     return selectedItem.text;
    }
  }

  addItem(): void {
  const formValues = this.purchaseOrderDetailForm.value;
  const newItem: PurchaseOrderDetail = {
    purchaseOrderDetailId: 0, 
    purchaseOrderId: 0, 
    lineItemId: formValues.lineItem,
    quantity: formValues.quantity,
    rate: formValues.rate,
    lineItemName: this.getSelectedText()
  };

  if (this.activeIndex !== null && this.activeIndex >= 0 && this.activeIndex < this.items.length) {
    this.items[this.activeIndex] = newItem;
    this.resetChildForm();
  } else {
    const existingItem = this.getItemByLineItemId(newItem.lineItemId);
    if (existingItem !== undefined && existingItem !== null 
      && existingItem.lineItemId === newItem.lineItemId ) {
      if (existingItem.rate !== newItem.rate) {
        this.showDifferentRateAlert();
      } else {
        existingItem.quantity += newItem.quantity;
        this.resetChildForm();
      }
    } else {
      this.items.push(newItem);
      this.resetChildForm();
    }
  }
 }


  getItemByLineItemId(lineItemId: number): PurchaseOrderDetail | undefined {
    return this.items.find(item => item.lineItemId === lineItemId);
  }

  resetChildForm(){
    this.purchaseOrderDetailForm.reset({
      purchaseOrderDetailId: 0,
      purchaseOrderId: 0,
      lineItemId: this.purchaseOrderDetailForm.value.item,
      quantity: null,
      rate: null
    });
    this.activeIndex = null;
  }

  editItem(index: number){
var item = this.getItemByIndex(index)
this.activeIndex = index;
if (item !== null) {
  this.purchaseOrderDetailForm.patchValue({
    lineItem: item.lineItemId, 
    quantity: item.quantity,
    rate: item.rate
  });
 }

}

showDifferentRateAlert(): void {
  this.modal.confirm({
    nzTitle: 'Rate Confirmation',
    nzContent: 'Are you sure you want to add an exixting item with different rate? This this will update existing rate.',
    nzOnOk: () => this.updateWithNewRate(),
    nzOnCancel: () => this.cancelAdd()
  });
}

updateWithNewRate(){
  const formValues = this.purchaseOrderDetailForm.value;
  const newItem: PurchaseOrderDetail = {
    purchaseOrderDetailId: 0, 
    purchaseOrderId: 0, 
    lineItemId: formValues.lineItem,
    quantity: formValues.quantity,
    rate: formValues.rate,
    lineItemName: this.getSelectedText()
  };

  const existingItem = this.getItemByLineItemId(newItem.lineItemId);
    if (existingItem !== undefined && existingItem !== null 
      && existingItem.lineItemId == newItem.lineItemId){
        existingItem.rate = newItem.rate;
        existingItem.quantity += newItem.quantity;
      }
  this.resetChildForm();
}

cancelAdd(){
  this.resetChildForm();
}

  getItemByIndex(index: number): any {
    if (index >= 0 && index < this.items.length) {
      return this.items[index];
    } else {
      console.error(`Invalid index ${index}. Returning null.`);
      return null;
    }
  }

  deleteItem(index: number){
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
    } 
  }

  save(): void {
    debugger;
    const purchaseOrder: PurchaseOrder = {
      purchaseOrderId: 0,
      referenceId: this.purchaseOrderForm.value.referenceId,
      purchaseOrderNumber: this.purchaseOrderForm.value.purchaseOrderNumber,
      purchaseOrderDate: this.purchaseOrderForm.value.purchaseOrderDate,
      supplierId: this.purchaseOrderForm.value.supplier,
      expectedDate: this.purchaseOrderForm.value.expectedDate,
      remarks: this.purchaseOrderForm.value.remarks,
      purchaseOrderDetails: this.items
    };

    const purchaseOrderWithDetails: PurchaseOrderWithDetailsCreationDto = {
      purchaseOrder: purchaseOrder,
      purchaseOrderDetails: this.items
    };

    this.purchaseOrderService.createPurchaseOrder(purchaseOrderWithDetails).subscribe(response => {
      this.notification.success('Success', 'Purchase order created successfully.');
      this.resetMasterForm();
    }, error => {
      this.notification.error('Error', 'Error creating purchase order:'+error); 
    });
  }

  resetMasterForm(){
    this.purchaseOrderForm.reset({
      purchaseOrderId: 0,
      referenceId: null,
      purchaseOrderNumber: '',
      purchaseOrderDate: null,
      supplierId: null,
      expectedDate: null,
      remarks: '',
      purchaseOrderDetails: []
    });
    this.items = [];
  }

  close() : void{
    this.resetMasterForm();
    this.router.navigate(['/pages/purchase-orders']);
  }
}