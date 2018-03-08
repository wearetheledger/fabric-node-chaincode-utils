import { Stub } from 'fabric-shim';
import { Chaincode, ChaincodeError, Helpers, TransactionHelper } from '@theledger/fabric-chaincode-utils';

export class MyChaincode extends Chaincode {

    async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        Helpers.checkArgs(args, 1);

        let carNumber = args[0];

        const car = txHelper.getStateAsObject(carNumber);

        if (!car) {
            throw new ChaincodeError('Car does not exist');
        }

        return car;
    }

    async initLedger(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let cars = [{
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        }, {
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        }, {
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        }, {
            make: 'Volkswagen',
            model: 'Passat',
            color: 'yellow',
            owner: 'Max'
        }, {
            make: 'Tesla',
            model: 'S',
            color: 'black',
            owner: 'Adriana'
        }, {
            make: 'Peugeot',
            model: '205',
            color: 'purple',
            owner: 'Michel'
        }, {
            make: 'Chery',
            model: 'S22L',
            color: 'white',
            owner: 'Aarav'
        }, {
            make: 'Fiat',
            model: 'Punto',
            color: 'violet',
            owner: 'Pari'
        }, {
            make: 'Tata',
            model: 'Nano',
            color: 'indigo',
            owner: 'Valeria'
        }, {
            make: 'Holden',
            model: 'Barina',
            color: 'brown',
            owner: 'Shotaro'
        }];

        for (let i = 0; i < cars.length; i++) {
            const car: any = cars[i];

            car.docType = 'car';
            await txHelper.putState('CAR' + i, car);
            Helpers.log('Added <--> ', car);
        }

    }

    async createCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.checkArgs(args, 5);

        let car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await txHelper.putState(args[0], car);
    }

    async queryAllCars(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let startKey = 'CAR0';
        let endKey = 'CAR999';

        return await txHelper.getStateByRangeAsList(startKey, endKey);

    }

    async changeCarOwner(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.checkArgs(args, 2);

        let car = await txHelper.getStateAsObject(args[0]);

        car.owner = args[1];

        await txHelper.putState(args[0], car);
    }
}