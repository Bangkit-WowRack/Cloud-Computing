export class uncompleteRequest extends Error {
    constructor(code, message) {
        super(message);
        this.name = "uncompleteRequest";
        this.code = code;
    }
}