import BaseModel from './BaseModel';

export default class Category extends BaseModel {
    private name: string;
    private description: string;

    public setName(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getDescription(): string {
        return this.description;
    }

    public isValid(): boolean {
        return !!this.name && !!this.description;
    }

}
