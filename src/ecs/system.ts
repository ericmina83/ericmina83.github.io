import type { ECS } from ".";

/**
 * The init order is the order you construct the system.
 * The update order is the order you want the system to be updated.
 */
export abstract class ECSSystem {
  public initiated: boolean = false;
  /**
   * 
   * @param updateOrder 
   */
  constructor(public updateOrder: number) { }

  public abstract init?: (ecs: ECS) => void;

  public abstract update?: (ecs: ECS, delta: number) => void;
}
