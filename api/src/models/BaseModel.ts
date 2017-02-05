export default class BaseModel {
    private id: string;

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

}
