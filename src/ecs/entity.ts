import type { ECSComponent, ComponentConstructor } from "./component";

export class ECSEntity {
  private readonly components: ECSComponent[];

  constructor(public readonly id: string, components: ECSComponent[] = []) {
    this.components = [...components];
  }

  public contains<T extends ECSComponent>(ctors: ComponentConstructor<T>[]): boolean {
    return ctors.every((ctor) =>
      this.components.some((component) => component.check(ctor))
    );
  }

  public addComponent<C extends ECSComponent>(component: C): void {
    if (
      this.getComponent(component.constructor as ComponentConstructor<C>) !==
      undefined
    ) {
      throw new Error(
        `Component ${component.constructor.name} already exists in entity ${this.id}.`
      );
    }
    this.components.push(component);
  }

  public getComponent<C extends ECSComponent>(ctor: ComponentConstructor<C>): C | undefined {
    return this.components.find((component): component is C => component.check(ctor));
  }
}
