export class deviceNotRegistered extends Error {
    constructor(message, device_id) {
        super(message);
        this.device_id = device_id;
    }
}
