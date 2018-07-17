/* tslint:disable */
import { ChaincodeMockStub } from '@theledger/fabric-mock-stub';
import { TestChaincode } from './TestChaincode';
import { StubHelper } from '../src';

import { expect } from 'chai';

const chaincode = new TestChaincode();

describe('Test StubHelper', () => {

    it('putState string', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = 'val';

        await stubHelper.putState('test', value);

        expect(Object.keys(stub.state).length).to.equal(1);
        expect(Object.keys(stub.state)[0]).to.equal('test');
        expect(Buffer.from(stub.state["test"]).toString('utf8')).to.equal(value);

    });

    it('putState object', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        expect(Object.keys(stub.state).length).to.equal(1);
        expect(Object.keys(stub.state)[0]).to.equal('test');
        expect(JSON.parse(Buffer.from(stub.state["test"]).toString('utf8'))).to.deep.equal(value);

    });

    it('getStateAsString', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = 'val';

        await stubHelper.putState('test', value);

        const res: string = await stubHelper.getStateAsString('test');

        expect(res).to.eq(value)
    });

    it('getStateAsObject', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };
        await stubHelper.putState('test', value);

        const res: object = await stubHelper.getStateAsObject('test');

        expect(res).to.deep.eq(value)
    });

    it('getStateAsDate', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = new Date();
        await stubHelper.putState('test', value);

        const res: Date = await stubHelper.getStateAsDate('test');

        expect(res).to.deep.eq(value)
    });

    it('getChaincodeCrypto', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const res = await stubHelper.getChaincodeCrypto();

        expect(res.constructor.name).to.eq("ChaincodeCryptoLibrary")
    });

    it('getClientIdentity', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const res = await stubHelper.getClientIdentity();

        expect(res.constructor.name).to.eq("ClientIdentity")
    });


    it('getQueryResultAsList', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        const value2 = {
            otherprop: 4
        };

        await stubHelper.putState('test2', value2);

        const res: object[] = await stubHelper.getQueryResultAsList({
            selector: {
                testObject: 1
            }
        });

        expect(res.length).to.eq(1)
    });

    it('deleteAllByQuery all', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        const value2 = {
            otherprop: 4
        };

        await stubHelper.putState('test2', value2);

        await stubHelper.deleteAllByQuery({
            selector: {
                $or: [
                    {testObject: 1},
                    {otherprop: 4},
                ]
            }
        });

        expect(Object.keys(stub.state).length).to.equal(0);
    });

    it('deleteAllByQuery one', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        const value2 = {
            otherprop: 4
        };

        await stubHelper.putState('test2', value2);

        await stubHelper.deleteAllByQuery({
            selector: {
                testObject: 1
            }
        });

        expect(Object.keys(stub.state).length).to.equal(1);
    });

    it('getHistoryForKeyAsList', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        const value2 = {
            otherprop: 4
        };

        await stubHelper.putState('test', value2);

        const res: object[] = await stubHelper.getHistoryForKeyAsList('test');

        expect(res.length).to.equal(2);
        expect(res[0].value).to.deep.equal(value);
        expect(res[1].value).to.deep.equal(value2);
    });

    it('getStateByRangeAsList should return 2', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        await stubHelper.putState('test3', value);

        await stubHelper.putState('test5', value);

        const res: object[] = await stubHelper.getStateByRangeAsList('test', 'test3');

        expect(res.length).to.equal(2);
    });

    it('getStateByRangeAsList should return all', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value);

        await stubHelper.putState('test3', value);

        await stubHelper.putState('test5', value);

        const res: object[] = await stubHelper.getStateByRangeAsList('', '');

        expect(res.length).to.equal(3);
    });

    it('getStateByRangeAsList with keys should return all', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        await stubHelper.putState('CAR1', "val1");

        await stubHelper.putState('CAR3', "val3");

        await stubHelper.putState('CAR5', "val5");


        const res: object[] = await stubHelper.getStateByRangeAsList('CAR1', 'CAR999');

        expect(res.length).to.equal(3);
    });

    it('putState private object', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value, {privateCollection: "testCollection"});

        expect(Object.keys(stub.privateCollections["testCollection"]).length).to.equal(1);
        expect(Object.keys(stub.privateCollections["testCollection"])[0]).to.equal('test');
        expect(JSON.parse(Buffer.from(stub.privateCollections["testCollection"]["test"]).toString('utf8'))).to.deep.equal(value);

    });

    it('getStateAsString private', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = 'val';

        await stubHelper.putState('test', value, {privateCollection: "testCollection"});

        const res: string = await stubHelper.getStateAsString('test', {privateCollection: "testCollection"});

        expect(res).to.eq(value)
    });

    it('getStateAsObject private', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = {
            testObject: 1
        };

        await stubHelper.putState('test', value, {privateCollection: "testCollection"});

        const res: object = await stubHelper.getStateAsObject('test', {privateCollection: "testCollection"});

        expect(res).to.deep.eq(value)
    });

    it('getStateAsDate private', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const stubHelper = new StubHelper(stub);

        const value = new Date();

        await stubHelper.putState('test', value, {privateCollection: "testCollection"});

        const res: Date = await stubHelper.getStateAsDate('test', {privateCollection: "testCollection"});

        expect(res).to.deep.eq(value)
    });

});
