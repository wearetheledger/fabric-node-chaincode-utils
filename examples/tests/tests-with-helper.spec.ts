import { TestHelper, ChainMethod } from './helper';
import { MyChaincode } from '../src/MyChaincode';

const chaincode = new MyChaincode();

const chainMethods: ChainMethod[] = [
    {
        itShouldInvoke: `Should be able to init `,
        invoke: {
            fcn: `initLedger`,
            args: []
        },
        itShouldQuery: `Should be able to query all cars`,
        query: {
            fcn: `queryAllCars`,
            args: [],
            expected: [
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
            ]
        },
    },
    {
        itShouldInvoke: `Should be able to add a car`,
        invoke: {
            fcn: `createCar`,
            args: [`CAR0`, `prop1`, `prop2`, `prop3`, `owner`]
        },
        itShouldQuery: `Should be able to query a car`,
        query: {
            fcn: `queryCar`,
            args: [`CAR0`],
            expected: {
                'make': 'prop1',
                'model': 'prop2',
                'color': 'prop3',
                'owner': 'owner',
                'docType': 'car'
            }
        },
    },
    {
        itShouldInvoke: `Should be able to change a car owner`,
        invoke: {
            fcn: `changeCarOwner`,
            args: [`CAR0`, `owner2`]
        },
        itShouldQuery: `Should be able to query the changed car object`,
        query: {
            fcn: `queryCar`, args: [`CAR0`],
            expected: {
                'make': 'prop1',
                'model': 'prop2',
                'color': 'prop3',
                'owner': 'owner2',
                'docType': 'car'
            }
        },
    },
    // etc...
];

TestHelper.runTests(chaincode, chainMethods);