import { SideNavInterface } from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
    {
        path: '',
        title: 'Dashboard',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        submenu: [
            {
                path: '/dashboard/default',
                title: 'Default',
                iconType: '',
                icon: '',
                iconTheme: '',
                submenu: []
            },
          
        ]
    },
  
    {
        path: '',
        title: 'Pages',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'file',
        submenu: [           
            {
                path: '/pages/purchase-orders',
                title: 'Purhcase Order',
                iconType: '',
                icon: '',
                iconTheme: '',
                submenu: []
            },
        ]
    },
    
]    