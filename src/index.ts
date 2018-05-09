import { Chaincode } from './Chaincode';
import { StubHelper } from './StubHelper';
import { Transform } from './utils/datatransform';
import { Helpers } from './utils/helpers';
import { ChaincodeError } from './utils/errors/ChaincodeError';

export {
    Chaincode,
    StubHelper,
    ChaincodeError,
    Transform,
    Helpers
}

export interface KV {
    key: string;
    value: any;
}

export interface KeyModificationItem {
    is_delete: boolean;
    value: Object;
    timestamp: number;
    tx_id: string;
}
