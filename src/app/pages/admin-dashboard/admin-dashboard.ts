import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';
import { AgGridAngular } from 'ag-grid-angular'; 
import type { ColDef, ValueFormatterParams, GetRowIdParams } from 'ag-grid-community'; 

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  rowData = [
    { ID: 1, Name: "Shirt", Description: "Casual cotton shirt", Price: 25,Category: "men", Status: "In Stock" },
    { ID: 2, Name: "Jeans", Description: "Slim fit denim", Price: 50,Category: "men", Status: "In Stock" },
    { ID: 3, Name: "Jacket", Description: "Leather winter jacket", Price: 120,Category: "men", Status: "Out of Stock" },
    { ID: 4, Name: "Socks", Description: "Pack of 3 ankle socks", Price: 8,Category: "men", Status: "In Stock" },
    { ID: 5, Name: "Hat", Description: "Baseball cap", Price: 15,Category: "men",Status: "In Stock" },
    { ID: 6, Name: "Sneakers", Description: "Running shoes", Price: 85,Category: "men", Status: "Low Stock" },
    { ID: 7, Name: "Belt", Description: "Classic brown leather", Price: 20,Category: "men", Status: "In Stock" }
  ];

  colDefs: ColDef[] = [
    { field: "ID", width: 100, flex: 0 },
    { field: "Name" },
    { field: "Description", editable: true, cellEditor: 'agTextCellEditor' },
    { field: "Price", valueFormatter: this.priceFormatter },
    { field: "Category" },
    { field: "Status" },
    {
      headerName: "Actions",
      cellStyle: { backgroundColor: '#ffffff'},
      sortable: false,
      filter: false,
      flex: 0,
      width: 120,
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.className = 'grid-delete-btn';
        button.innerText = 'Delete';
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          
          
          params.api.applyTransaction({ remove: [params.data] });
          
          // Keep your local reference array sync'd with the deletion event
          this.syncLocalData(params.data);
        });
        return button;
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true
  };

  getRowId = (params: GetRowIdParams) => String(params.data.ID);

  priceFormatter(params: ValueFormatterParams): string {
    return params.value != null ? `$${Number(params.value).toFixed(2)}` : '';
  }

  // FIX 2: Moved sync array isolation out of the renderer loop to protect context execution
  syncLocalData(rowToRemove: any): void {
    this.rowData = this.rowData.filter(item => item.ID !== rowToRemove.ID);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
  }
}