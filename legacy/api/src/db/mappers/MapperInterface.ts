export interface MapperInterface<T, U> {
    hydrate(entity: T, data: U): T;
    dehydrate(entity: T): U;
}