// In-Built
import { Injectable } from '@angular/core';

// Services
import { CanAuthService } from 'src/@can/services/auth/auth.service';

// Types
import { CanPermission, CanGroupPermission } from 'src/@can/types/permission.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

@Injectable({
  providedIn: 'root'
})
export class CanPermissionService {

  constructor(private authService: CanAuthService) { }

  // /**
  //  * Set Permission Object in Local Storage
  //  */
  // public setPermissions(): void {
  //   const permissions = this.createPermissionsObject();
  //   localStorage.setItem('permissions', JSON.stringify(permissions));
  // }
  
    /**
   * Set Permission Object in Local Storage
   */
  public setPermissions() {
    return new Promise((resolve) => {
      // const permissions = this.createPermissionsObject();
      this.authService.validate().subscribe((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem(
          "permissions",
          JSON.stringify(user["permissions"])
        );
        resolve(true);
      });
    });
  }


  /**
   * Get Permission Object from Local Storage
   */
  public getPermissions(): object {
    const permissions = localStorage.getItem('permissions');
    if (permissions) {
      return JSON.parse(permissions);
    }
    return null;
  }

  /**
   * 
   * @param permissionConfig: CanPermisson
   * 
   * Validate Permission based on Permission Config
   * 
   */
  public validatePermission(permissionConfig: CanPermission): boolean {
    const permissions = this.getPermissions();
    if (permissionConfig) {
      if (permissions) {
        if (permissionConfig.type === 'single') {
          // Check condition and return result
          return this.singleValidate(permissionConfig, permissions);
        } else if (permissionConfig.type === 'group') {
          return this.groupValidate(permissionConfig.group, permissions);
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }


  /**
   * 
   * @param displayCondition :CanConditionConfig
   * @param data : object
   * 
   * Check Display Condition for field action and return result
   */
  private singleValidate(permissionConfig: CanPermission, permissions: object): boolean {
    // Checking Display Condition Match Existence
    if (permissionConfig.match) {
      // return
      return CanHelper.mapValueWithApiKey(permissions, permissionConfig.match.key) === permissionConfig.match.value;
    } else {
      return true;
    }
  }

  /**
   * 
   * @param group :CanGroupCondition
   * @param data : object
   * 
   * Check Display Condition for field action and return result
   */
  private groupValidate(group: CanGroupPermission, permissions: object): boolean {
    // Check for group existence
    if (group && group.values && group.values.length) {
      // Check for operator
      if (group.type === 'and') {
        // If any value in array if false return false
        group.values.forEach(element => {
          if (element.type === 'single') {
            if (!this.singleValidate(element, permissions)) {
              return false;
            }
          } else if (element.type === 'group') {
            if (!this.groupValidate(element.group, permissions)) {
              return false;
            }
          }
        });
        return true;
      } else if (group.type === 'or') {
        // If any value in array if true return true
        group.values.forEach(element => {
          if (element.type === 'single') {
            if (this.singleValidate(element, permissions)) {
              return true;
            }
          } else if (element.type === 'group') {
            if (!this.groupValidate(element.group, permissions)) {
              return true;
            }
          }
        });
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Manipulate Permission Object
   */
  private createPermissionsObject(): object {
    const permissionObject = this.extractPermissionsObjectFromToken();
    const permissions = {};
    for (const eachModel of permissionObject['permissions']) {
      const key = Object.keys(eachModel)[0];
      const keyPermissions = {};
      for (const each of eachModel[key]) {
        keyPermissions[each] = true;
      }
      permissions[key] = keyPermissions;
    }
    return permissions;
  }

  /**
   * Extract Permission Object from Auth Token
   */
  private extractPermissionsObjectFromToken(): object {
    const token = this.authService.getToken();
    return JSON.parse(atob(token.split('.')[1]));
  }

}
