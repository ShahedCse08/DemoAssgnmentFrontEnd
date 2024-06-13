import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderCreateComponent } from './purchase-order/purchase-order-create/purchase-order-create.component';
import { PurchaseOrderEditComponent } from './purchase-order/purchase-order-edit/purchase-order-edit.component';

const routes: Routes = [
   
    {
        path: 'purchase-orders',
        component: PurchaseOrderListComponent,
        data: {
            title: 'Purchase Orders'
        }
    },
    {
        path: 'purchase-order-create',
        component: PurchaseOrderCreateComponent,
        data: {
            title: 'Create Purchase Orders'
        }
    },
    {
        path: 'purchase-order-edit/:id',
        component: PurchaseOrderEditComponent,
        data: {
            title: 'Edit Purchase Orders'
        }
    },
   
  
    {
        path: 'blog',
        data: {
            title: 'Blog '
        },
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            }, 
            
        ]    
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule { }
