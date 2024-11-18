import { Injectable } from "@angular/core";
import {
  CanConditionConfig,
  CanGroupCondition,
} from "src/@can/types/shared.type";
import { CanHelper } from "src/@can/utils/helper.util";

@Injectable({
  providedIn: "root",
})
export class CanConditionValidationService {
  constructor() {}

  /**
   *
   * @param condition :CanConditionConfig
   * @param data :object
   * Check whether to display field action or not
   */
  public validate(condition: CanConditionConfig, data: object) {
    // Check Display Condition Type
    if (condition.type === "single") {
      // Check condition and return result
      return this.singleValidate(condition, data);
    } else if (condition.type === "group") {
      return this.groupValidate(condition.group, data);
    }
  }

  /**
   *
   * @param condition :CanConditionConfig
   * @param data : object
   *
   * Check Display Condition for field action and return result
   */
  private singleValidate(condition: CanConditionConfig, data: object) {
    // Check operator and condition accordingly
    switch (condition.match.operator) {
      case "equals":
        return (
          CanHelper.mapValueWithApiKey(data, condition.match.key) ===
          condition.match.value
        );
      case "notEquals":
        return (
          CanHelper.mapValueWithApiKey(data, condition.match.key) !==
          condition.match.value
        );
      case "empty":
        return this.empty(
          CanHelper.mapValueWithApiKey(data, condition.match.key)
        );
      case "notEmpty":
        return !this.empty(
          CanHelper.mapValueWithApiKey(data, condition.match.key)
        );
    }
  }

  private empty(val: any) {
    const result =
      val === null ||
      val === undefined ||
      val === "" ||
      JSON.stringify(val) === JSON.stringify({}) ||
      JSON.stringify(val) === JSON.stringify([]);
    return result;
  }

  /**
   *
   * @param group :CanGroupCondition
   * @param data : object
   *
   * Check Display Condition for field action and return result
   */
  private groupValidate(group: CanGroupCondition, data: object) {
    // Check for operator
    if (group.type === "and") {
      // If any value in array if false return false
      for (let element of group.values) {
        if (element.type === "single") {
          if (!this.singleValidate(element, data)) {
            return false;
          }
        } else if (element.type === "group") {
          if (!this.groupValidate(element.group, data)) {
            return false;
          }
        }
      }
      return true;
    } else if (group.type === "or") {
      // If any value in array if true return true
      for (let element of group.values) {
        if (element.type === "single") {
          if (this.singleValidate(element, data)) {
            return true;
          }
        } else if (element.type === "group") {
          if (!this.groupValidate(element.group, data)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
