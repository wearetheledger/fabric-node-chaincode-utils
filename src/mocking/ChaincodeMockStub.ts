import {
    ChaincodeReponse,
    Iterators,
    KV,
    MockStub,
    ProposalCreator,
    SignedProposal,
    SplitCompositekey
} from 'fabric-shim';

import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { MockStateQueryIterator } from './MockStateQueryIterator';
import { Chaincode } from '../Chaincode';
import { ChaincodeProposalCreator } from './ChaincodeProposalCreator';
import { CompositeKeys } from './CompositeKeys';
import { Helpers } from '../utils/helpers';
import { LoggerInstance } from 'winston';
import * as queryEngine from '@theledger/couchdb-query-engine';
import { ChaincodeError } from '../ChaincodeError';
import { Transform } from '../utils/datatransform';

const defaultUserCert = '-----BEGIN CERTIFICATE-----' +
    'MIIB6TCCAY+gAwIBAgIUHkmY6fRP0ANTvzaBwKCkMZZPUnUwCgYIKoZIzj0EAwIw' +
    'GzEZMBcGA1UEAxMQZmFicmljLWNhLXNlcnZlcjAeFw0xNzA5MDgwMzQyMDBaFw0x' +
    'ODA5MDgwMzQyMDBaMB4xHDAaBgNVBAMTE015VGVzdFVzZXJXaXRoQXR0cnMwWTAT' +
    'BgcqhkjOPQIBBggqhkjOPQMBBwNCAATmB1r3CdWvOOP3opB3DjJnW3CnN8q1ydiR' +
    'dzmuA6A2rXKzPIltHvYbbSqISZJubsy8gVL6GYgYXNdu69RzzFF5o4GtMIGqMA4G' +
    'A1UdDwEB/wQEAwICBDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBTYKLTAvJJK08OM' +
    'VGwIhjMQpo2DrjAfBgNVHSMEGDAWgBTEs/52DeLePPx1+65VhgTwu3/2ATAiBgNV' +
    'HREEGzAZghdBbmlscy1NYWNCb29rLVByby5sb2NhbDAmBggqAwQFBgcIAQQaeyJh' +
    'dHRycyI6eyJhdHRyMSI6InZhbDEifX0wCgYIKoZIzj0EAwIDSAAwRQIhAPuEqWUp' +
    'svTTvBqLR5JeQSctJuz3zaqGRqSs2iW+QB3FAiAIP0mGWKcgSGRMMBvaqaLytBYo' +
    '9v3hRt1r8j8vN0pMcg==' +
    '-----END CERTIFICATE-----';

/**
 * Mock implementation of the fabric-shim stub
 */
export class ChaincodeMockStub implements MockStub {

    private logger: LoggerInstance;

    private txTimestamp: Timestamp;
    private txID: string;
    private args: string[];
    public state: Map<string, Buffer> = new Map();
    private invokables: Map<string, MockStub>;
    private signedProposal: SignedProposal;

    /**
     * @param {string} name - Name of the mockstub
     * @param {Chaincode} cc - Your chaincode
     * @param {string} [usercert] - User creds certificate with/without attributes
     */
    constructor(private name: string, private cc: Chaincode, private usercert: string = defaultUserCert) {
        this.logger = Helpers.log(this.name);
    }

    /**
     * @returns {string}
     */
    getTxID(): string {
        return this.txID;
    }

    /**
     * Get the current arguments
     *
     * @returns {string[]}
     */
    getArgs(): string[] {
        return this.args;
    }

    /**
     * Same as getArgs()
     *
     * @returns {string[]}
     */
    getStringArgs(): string[] {
        return this.args;
    }

    /**
     * @returns {{params: string[]; fcn: string}}
     */
    getFunctionAndParameters(): { params: string[]; fcn: string } {

        const params = this.getStringArgs();
        let fcn = '';

        if (params.length >= 1) {
            fcn = params[0];
            params.splice(0, 1);
        }

        return {
            fcn,
            params,
        };
    }

    /**
     * Used to indicate to a chaincode that it is part of a transaction.
     * This is important when chaincodes invoke each other.
     * MockStub doesn't support concurrent transactions at present.
     *
     * @param {string} txid
     */
    mockTransactionStart(txid: string): void {
        this.txID = txid;
        this.setSignedProposal(<SignedProposal>{});
        this.setTxTimestamp(new Timestamp());
    }

    /**
     * End a mocked transaction, clearing the UUID.
     *
     * @param {string} uuid
     */
    mockTransactionEnd(uuid: string): void {
        this.signedProposal = null;
        this.txID = '';
    }

    /**
     * Register a peer chaincode with this MockStub
     * invokableChaincodeName is the name or hash of the peer
     * otherStub is a MockStub of the peer, already intialised
     *
     * @param {string} invokableChaincodeName
     * @param {"fabric-shim".MockStub} otherStub
     */
    mockPeerChaincode(invokableChaincodeName: string, otherStub: MockStub): void {
        this.invokables[invokableChaincodeName] = otherStub;
    }

    /**
     * Initialise this chaincode,  also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @returns {Promise<"fabric-shim".ChaincodeReponse>}
     */
    async mockInit(uuid: string, args: string[]): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        const res = await this.cc.Init(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @returns {Promise<"fabric-shim".ChaincodeReponse>}
     */
    async mockInvoke(uuid: string, args: string[]): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        const res = await this.cc.Invoke(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    /**
     * InvokeChaincode calls a peered chaincode.
     *
     * @param {string} chaincodeName
     * @param {Buffer[]} args
     * @param {string} channel
     * @returns {Promise<"fabric-shim".ChaincodeReponse>}
     */
    async invokeChaincode(chaincodeName: string, args: Buffer[], channel: string): Promise<ChaincodeReponse> {
        // Internally we use chaincode name as a composite name
        if (channel != '') {
            chaincodeName = chaincodeName + '/' + channel;
        }

        const otherStub = this.invokables[chaincodeName];

        return await otherStub.MockInvoke(this.txID, args);
    }

    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param {"fabric-shim".SignedProposal} sp
     * @returns {Promise<"fabric-shim".ChaincodeReponse>}
     */
    async mockInvokeWithSignedProposal(uuid: string, args: string[], sp: SignedProposal): Promise<ChaincodeReponse> {
        this.args = args;
        this.mockTransactionStart(uuid);
        this.signedProposal = sp;
        const res = await this.cc.Invoke(this);
        this.mockTransactionEnd(uuid);
        return res;
    }

    /**
     * Get a stored value for this key in the local state
     *
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    getState(key: string): Promise<Buffer> {
        return this.state[key];
    }

    /**
     * Store a value for this key in the local state
     *
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    putState(key: string, value: Buffer): Promise<any> {
        if (this.txID == '') {
            return Promise.reject('Cannot putState without a transactions - call stub.mockTransactionStart()?');
        }

        this.state[key] = value;

        return Promise.resolve();
    }

    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param {string} key
     * @returns {Promise<any>}
     */
    deleteState(key: string): Promise<any> {
        delete this.state[key];

        return Promise.resolve();
    }

    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator> {

        function strcmp(a: string, b: string) {
            if (a.toString() < b.toString()) {
                return -1;
            }
            if (a.toString() > b.toString()) {
                return 1;
            }
            return 0;
        }

        const items: KV[] = Object.keys(this.state)
            .filter((k: string) => {
                const comp1 = strcmp(k, startKey);
                const comp2 = strcmp(k, endKey);

                return (comp1 >= 0 && comp2 <= 0) || (startKey == '' && endKey == '');
            })
            .map((k: string): KV => {
                return {
                    key: k,
                    value: this.state[k]
                };
            });

        return Promise.resolve(new MockStateQueryIterator(items));

    }

    /**
     *
     * GetQueryResult function can be invoked by a chaincode to perform a
     * rich query against state database.  Only supported by state database implementations
     * that support rich query.  The query string is in the syntax of the underlying
     * state database. An iterator is returned which can be used to iterate (next) over
     * the query result set.
     *
     * Blog post on writing rich queries -
     * https://medium.com/wearetheledger/hyperledger-fabric-couchdb-fantastic-queries-and-where-to-find-them-f8a3aecef767
     *
     * @param {string} query
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getQueryResult(query: string): Promise<Iterators.StateQueryIterator> {

        const keyValues: any = {};

        Object.keys(this.state)
            .forEach(k => {
                keyValues[k] = Transform.bufferToObject(this.state[k]);
            });

        let parsedQuery: object;

        try {
            parsedQuery = JSON.parse(query);
        } catch (err) {
            throw new ChaincodeError('Error parsing query, should be string');
        }

        const items = queryEngine.parseQuery(keyValues, parsedQuery)
            .map((item: KV) => {
                return {
                    key: item.key,
                    value: Transform.serialize(item.value)
                };
            });

        return Promise.resolve(new MockStateQueryIterator(items));
    }

    /**
     * @todo Implement
     * @param {string} key
     * @returns {Promise<"fabric-shim".Iterators.HistoryQueryIterator>}
     */
    getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator> {
        return undefined;
    }

    /**
     * Retrieve state by partial keys
     *
     * @param {string} objectType
     * @param {string[]} attributes
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator> {
        const partialCompositeKey = CompositeKeys.createCompositeKey(objectType, attributes);

        return this.getStateByRange(partialCompositeKey, partialCompositeKey + CompositeKeys.MAX_UNICODE_RUNE_VALUE);
    }

    createCompositeKey(objectType: string, attributes: string[]): string {
        return CompositeKeys.createCompositeKey(objectType, attributes);
    }

    splitCompositeKey(compositeKey: string): SplitCompositekey {
        return CompositeKeys.splitCompositeKey(compositeKey);
    }

    getSignedProposal(): SignedProposal {
        return this.signedProposal;
    }

    setSignedProposal(sp: SignedProposal): void {
        this.signedProposal = sp;
    }

    setTxTimestamp(t: Timestamp): void {
        this.txTimestamp = t;
    }

    getTxTimestamp(): Timestamp {
        if (this.txTimestamp == null) {
            throw new Error('TxTimestamp not set.');
        }
        return this.txTimestamp;
    }

    getCreator(): ProposalCreator {
        return new ChaincodeProposalCreator('dummymspId', this.usercert);
    }

    /**
     * @todo Implement
     * @returns {string}
     */
    getBinding(): string {
        return undefined;
    }

    /**
     * @todo Implement
     *
     * @returns {Map<string, Buffer>}
     */
    getTransient(): Map<string, Buffer> {
        return undefined;
    }

    /**
     * @todo Implement
     *
     * @param {string} name
     * @param {Buffer} payload
     */
    setEvent(name: string, payload: Buffer): void {
        throw new Error('Not implemented');
    }

    /**
     * @todo Implement
     *
     * @returns {string}
     */
    getChannelID(): string {
        return undefined;
    }

}
