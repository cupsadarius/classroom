export default class SuccessResponse<T> {
    private status: boolean;
    private data: T;

    constructor(data: T) {
        this.status = true;
        this.data = data;
    }
}