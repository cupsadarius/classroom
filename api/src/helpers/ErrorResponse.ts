export default class ErrorResponse<T> {
    private status: boolean;
    private data: T;

    constructor(data: T) {
        this.status = false;
        this.data = data;
    }
}