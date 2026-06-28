import type { ECSSystem } from "./system";
import { ECSEntity } from "./entity";
import { ComponentConstructor, ECSComponent } from "./component";

export class ECS {
  private readonly systems: ECSSystem[] = [];
  private readonly entities: ECSEntity[] = [];

  private readonly mainEntity = this.createEntity("main");

  public addSystem(system: ECSSystem): void {
    this.systems.push(system);
  }

  public init(): void {
    for (const system of this.systems) {
      system.init?.(this);
      system.initiated = true;
    }
  }

  public update(deltaTime: number): void {
    if (!this.systems.every(system => system.initiated)) {
      return;
    }

    for (const system of this.systems) {
      console.log(system.updateOrder);
      system.update?.(this, deltaTime);
    }
  }

  public getEntities<T extends ECSComponent>(ctors: ComponentConstructor<T>[]) {
    return this.entities.filter((entity) => entity.contains(ctors));
  }

  public getEntityById(id: string): ECSEntity | undefined {
    return this.entities.find((entity) => entity.id === id);
  }

  public createEntity(id?: string) {
    id = id || crypto.randomUUID();
    let entity = this.getEntityById(id);
    if (entity) {
      throw new Error(`Entity with id ${id} already exists.`);
    }
    // Create a new entity if it does not exist
    entity = new ECSEntity(id);
    this.entities.push(entity);
    return entity;
  }

  public removeEntity(entity: ECSEntity): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  public getMainEntity(): ECSEntity {
    return this.mainEntity;
  }

  public updateOrder(): void {
    this.systems.sort((a, b) => a.updateOrder - b.updateOrder);
  }
}
