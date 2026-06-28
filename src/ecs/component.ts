export type ComponentConstructor<C extends ECSComponent> = new (
  ...args: never[]
) => C;

export abstract class ECSComponent {

  check<C extends ECSComponent>(ctor: ComponentConstructor<C>): this is C {
    return this instanceof ctor;
  }
}
