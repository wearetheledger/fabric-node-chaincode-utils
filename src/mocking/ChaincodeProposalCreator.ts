import { ProposalCreator } from 'fabric-shim';
import { IdBytes } from './IdBytes';

/**
 * @hidden
 */
export class ChaincodeProposalCreator implements ProposalCreator {

    [fieldName: string]: any;
    mspid: string;

    constructor(private mspId: string, private signingId: string) {
    }

    getMspid(): string {
        return this.mspId;
    }

    getIdBytes(): IdBytes {
        return new IdBytes(this.signingId);
    }
}