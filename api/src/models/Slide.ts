import BaseModel from './BaseModel';

export default class Slide extends BaseModel {
    private name: string;
    private path: string;
    private order: number;
    private type: string;

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getPath(): string {
        return this.path;
    }

    public setPath(path: string) {
        this.path = path;
    }

    public getOrder(): number {
        return this.order;
    }

    public setOrder(order: number) {
        this.order = order;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string) {
        this.type = type;
    }
}
