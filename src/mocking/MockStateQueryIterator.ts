import { Iterators, KV } from 'fabric-shim';

/**
 * @hidden
 */
export class MockStateQueryIterator implements Iterators.StateQueryIterator {

    private currentLoc = 0;
    private closed = false;

    constructor(private data: KV[]) {
    }

    next(): Promise<{ value: any; done: boolean }> {

        if (this.closed) {
            throw new Error('Iterator has already been closed');
        }

        this.currentLoc++;

        return Promise.resolve({
            value: this.data[this.currentLoc - 1],
            done: this.data.length <= this.currentLoc
        });
    }

    close(): void {
        this.closed = true;
    }

}