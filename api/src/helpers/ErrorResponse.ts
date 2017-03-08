export default class ErrorResponse {
    private status: boolean;
    private data: {message?: string | string[]};

    constructor(data: {message?: string | string[]}) {
        this.status = false;
        this.data = data.message ? data.message : data;
    }
}