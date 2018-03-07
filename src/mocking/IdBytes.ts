export class IdBytes {
    constructor(private cert: string) {

    }

    toBuffer(): Buffer {
        return Buffer.from(this.cert);
    }
}