/* tslint:disable */

import { MyChaincode } from '../src/MyChaincode';
import { ChaincodeMockStub, Transform } from '@theledger/fabric-mock-stub';

import { expect } from "chai";

const chaincode = new MyChaincode();

describe('Test MyChaincode', () => {

    it("Should init without issues", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        const response = await stub.mockInit("tx1", []);

        expect(response.status).to.eql(200)
    });

    it("Should be able to init and query all cars", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        const response = await stub.mockInvoke("txID1", ["initLedger"]);

        expect(response.status).to.eql(200);

        const queryResponse = await stub.mockInvoke("txID2", ["queryAllCars"]);

        expect(Transform.bufferToObject(queryResponse.payload)).to.deep.eq([
            {
                make: 'Toyota',
                model: 'Prius',
                color: 'blue',
                owner: 'Tomoko',
                docType: 'car'
            },
            {
                make: 'Ford',
                model: 'Mustang',
                color: 'red',
                owner: 'Brad',
                docType: 'car'
            },
            {
                make: 'Hyundai',
                model: 'Tucson',
                color: 'green',
                owner: 'Jin Soo',
                docType: 'car'
            },
            {
                make: 'Volkswagen',
                model: 'Passat',
                color: 'yellow',
                owner: 'Max',
                docType: 'car'
            },
            {
                make: 'Tesla',
                model: 'S',
                color: 'black',
                owner: 'Adriana',
                docType: 'car'
            },
            {
                make: 'Peugeot',
                model: '205',
                color: 'purple',
                owner: 'Michel',
                docType: 'car'
            },
            {
                make: 'Chery',
                model: 'S22L',
                color: 'white',
                owner: 'Aarav',
                docType: 'car'
            },
            {
                make: 'Fiat',
                model: 'Punto',
                color: 'violet',
                owner: 'Pari',
                docType: 'car'
            },
            {
                make: 'Tata',
                model: 'Nano',
                color: 'indigo',
                owner: 'Valeria',
                docType: 'car'
            },
            {
                make: 'Holden',
                model: 'Barina',
                color: 'brown',
                owner: 'Shotaro',
                docType: 'car'
            }
        ])
    });

    it("Should be able to add a car", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        const response = await stub.mockInvoke("tx1", ['createCar', `CAR0`, `prop1`, `prop2`, `prop3`, `owner`]);

        expect(response.status).to.eql(200)

        const response = await stub.mockInvoke("tx1", ['queryCar', `CAR0`]);

        expect(Transform.bufferToObject(response.payload)).to.deep.eq({
            'make': 'prop1',
            'model': 'prop2',
            'color': 'prop3',
            'owner': 'owner',
            'docType': 'car'
        })
    });

    it("Should be able to update a car", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        const response = await stub.mockInvoke("tx1", ['createCar', `CAR0`, `prop1`, `prop2`, `prop3`, `owner`]);

        expect(response.status).to.eql(200);

        const response = await stub.mockInvoke("tx2", ['queryCar', `CAR0`]);

        expect(Transform.bufferToObject(response.payload)).to.deep.eq({
            'make': 'prop1',
            'model': 'prop2',
            'color': 'prop3',
            'owner': 'owner',
            'docType': 'car'
        });

        const response = await stub.mockInvoke("tx3", ['changeCarOwner', `CAR0`, 'newOwner']);

        expect(response.status).to.eql(200);

        const response = await stub.mockInvoke("tx4", ['queryCar', `CAR0`]);


        expect(Transform.bufferToObject(response.payload).owner).to.eq("newOwner")
    });
});