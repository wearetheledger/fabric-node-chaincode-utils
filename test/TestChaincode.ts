/* tslint:disable */
import { Helpers } from '../src/utils/helpers';
import { ChaincodeReponse, Stub } from 'fabric-shim';
import { Chaincode } from '../src/Chaincode';
import { TransactionHelper } from '../src/TransactionHelper';
import { Transform } from '../src/utils/datatransform';
import { ChaincodeError } from '../src/ChaincodeError';
import shim = require('fabric-shim');

export class TestChaincode extends Chaincode {

    async Init(stub: Stub): Promise<ChaincodeReponse> {

        const args = stub.getArgs();

        if (args[0] == 'init') {
            await this.initLedger(stub, new TransactionHelper(stub));
        }

        return shim.success(Transform.serialize({
            args: stub.getArgs()
        }));
    }

    async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let carNumber = args[0];

        let carAsBytes: any = await stub.getState(carNumber); //get the car from chaincode state

        if (!carAsBytes || carAsBytes.toString().length <= 0) {
            throw new ChaincodeError('This car does not exist');
        }

        return carAsBytes;
    }

    async initLedger(stub: Stub, txHelper: TransactionHelper, args?: string[]) {
        Helpers.log('============= START : Initialize Ledger ===========');
        let cars = [];
        cars.push({
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        });
        cars.push({
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        });
        cars.push({
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        });
        cars.push({
            make: 'Volkswagen',
            model: 'Passat',
            color: 'yellow',
            owner: 'Max'
        });
        cars.push({
            make: 'Tesla',
            model: 'S',
            color: 'black',
            owner: 'Adriana'
        });
        cars.push({
            make: 'Peugeot',
            model: '205',
            color: 'purple',
            owner: 'Michel'
        });
        cars.push({
            make: 'Chery',
            model: 'S22L',
            color: 'white',
            owner: 'Aarav'
        });
        cars.push({
            make: 'Fiat',
            model: 'Punto',
            color: 'violet',
            owner: 'Pari'
        });
        cars.push({
            make: 'Tata',
            model: 'Nano',
            color: 'indigo',
            owner: 'Valeria'
        });
        cars.push({
            make: 'Holden',
            model: 'Barina',
            color: 'brown',
            owner: 'Shotaro'
        });

        for (let i = 0; i < cars.length; i++) {
            const car: any = cars[i];

            car.docType = 'car';
            await stub.putState('CAR' + i, Buffer.from(JSON.stringify(car)));
            Helpers.log('Added <--> ', car);
        }
        Helpers.log('============= END : Initialize Ledger ===========');
    }

    async createCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.log('============= START : Create Car ===========');

        Helpers.checkArgs(args, 5);

        let car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await txHelper.putState(args[0], car);
        Helpers.log('============= END : Create Car ===========');
    }

    async queryAllCars(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        let startKey = 'CAR0';
        let endKey = 'CAR999';

        return await txHelper.getStateByRangeAsList(startKey, endKey);
    }

    async changeCarOwner(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.log('============= START : changeCarOwner ===========');
        Helpers.checkArgs(args, 2);


        let carAsBytes = await stub.getState(args[0]);
        let car = JSON.parse(carAsBytes.toString());
        car.owner = args[1];

        await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
        Helpers.log('============= END : changeCarOwner ===========');
        shim.success();
    }
}