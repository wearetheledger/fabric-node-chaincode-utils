/* tslint:disable */

import { ChaincodeMockStub } from '@theledger/fabric-mock-stub';
import { TestChaincode } from './TestChaincode';
import { ChaincodeReponse } from 'fabric-shim';
import { Transform } from '../src/utils/datatransform';

import { expect } from 'chai';

const chaincode = new TestChaincode();

describe('Test Mockstub', () => {
    it('Should be able to init', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const args = ['arg1', 'arg2'];

        const response: ChaincodeReponse = await stub.mockInit('uudif', args);

        expect(Transform.bufferToObject(response.payload)['args']).to.deep.equal(args);
    });

    const stubWithInit = new ChaincodeMockStub('mock', chaincode);

    it('Should be able to init and make some cars', async () => {

        const args = ['init', 'arg2'];

        await stubWithInit.mockInit('uudif', args);

        expect(Object.keys(stubWithInit.state).length).to.equal(10);
    });

    it('Should be able to query first car', async () => {

        const car0 = {
            'make': 'Toyota',
            'model': 'Prius',
            'color': 'blue',
            'owner': 'Tomoko',
            'docType': 'car'
        };

        const response: ChaincodeReponse = await stubWithInit.mockInvoke('test', ['queryCar', 'CAR0']);

        expect(response.status).to.eq(200);

        expect(Transform.bufferToObject(response.payload)).to.deep.equal(car0);
    });

    it('Should be able to query using getStateByRange', async () => {

        const response: ChaincodeReponse = await stubWithInit.mockInvoke('test', ['queryAllCars']);

        expect(response.status).to.eq(200);

        expect(Transform.bufferToObject(response.payload)).to.be.length(10);
    });

    it('Should be able to mock composite keys', async () => {
        const stub = new ChaincodeMockStub('GetStateByPartialCompositeKeyTest', chaincode);

        stub.mockTransactionStart("composite");

        // Add car 1
        const car1 = {objectType: "CAR", make: "volvo", color: "red"};

        const ck1 = stub.createCompositeKey(car1.objectType, [car1.make, car1.color]);

        await stub.putState(ck1, Transform.serialize(car1));

        // Add car 2
        const car2 = {objectType: "CAR", make: "volvo", color: "blue"};

        const ck2 = stub.createCompositeKey(car2.objectType, [car2.make, car2.color]);

        await stub.putState(ck2, Transform.serialize(car2));

        // Add car 3
        const car3 = {objectType: "CAR", make: "jaguar", color: "red"};

        const ck3 = stub.createCompositeKey(car1.objectType, [car3.make, car3.color]);

        await stub.putState(ck3, Transform.serialize(car3));

        stub.mockTransactionEnd("composite");

        // should return in sorted order of attributes
        const expectKeys = [ck1, ck2];
        const expectKeysAttributes = [["volvo", "red"], ["volvo", "blue"]];
        const expectValues = [Transform.serialize(car1), Transform.serialize(car2)];

        const it = await stub.getStateByPartialCompositeKey("CAR", ["volvo"]);

        for (let i = 0; i < 2; i++) {
            const response = await it.next();

            if (expectKeys[i] !== response.value.key) {
                throw new Error(`Expected key ${expectKeys[i]} got ${response.value.key}`)
            }
            const t = stub.splitCompositeKey(response.value.key);

            if (t.objectType !== "CAR") {
                throw new Error(`Expected key "CAR" got ${t.objectType}`)
            }

            t.attributes.forEach((attr: string, index: number) => {
                if (expectKeysAttributes[i][index] != attr) {
                    throw new Error(`Expected keys attribute ${expectKeysAttributes[i][index]} got ${attr}`);
                }
            });

            expect(response.value.value).to.eql(expectValues[i]);

        }
    });

    it('Test create new car', async () => {

        const stub = new ChaincodeMockStub('mock', chaincode);

        const response: ChaincodeReponse = await stub.mockInvoke('test', ['createCar', 'CAR0', 'prop1', 'prop2', 'prop3', 'test']);

        expect(response.status).to.eq(200);

        expect(Object.keys(stub.state).length).to.equal(1);
    });


    it('Should be able to query using rich queries', async () => {

        const query = {
            selector: {
                make: "Toyota"
            }
        };

        const it = await stubWithInit.getQueryResult(JSON.stringify(query))

        const items = await Transform.iteratorToList(it);

        expect(items).to.deep.include({
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko',
            docType: 'car'
        })
    });

    it('Should be able to query using an rich query operator ', async () => {

        const query = {
            selector: {
                model: {
                    "$in": ['Nano', "Punto"]
                }
            }
        };

        const it = await stubWithInit.getQueryResult(JSON.stringify(query));

        const items = await Transform.iteratorToList(it);

        expect(items).to.be.length(2)
    });

});
