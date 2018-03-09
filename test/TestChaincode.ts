/* tslint:disable */
import { Helpers } from '../src/utils/helpers';
import { ChaincodeReponse } from 'fabric-shim';
import { Chaincode } from '../src/Chaincode';
import { ChaincodeError } from '../src/ChaincodeError';
import { StubHelper } from "../src/StubHelper";

export class TestChaincode extends Chaincode {

    async init(stubHelper: StubHelper, args: string[]): Promise<ChaincodeReponse> {

        if (args[0] == 'init') {
            await this.initLedger(stubHelper, args);
        }

        return {
            args
        }
    }

    async queryCar(stubHelper: StubHelper, args: string[]) {

        Helpers.checkArgs(args, 1);

        let carNumber = args[0];

        const car = stubHelper.getStateAsObject(carNumber);

        if (!car) {
            throw new ChaincodeError('Car does not exist');
        }

        return car;
    }

    async initLedger(stubHelper: StubHelper, args: string[]) {

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
            await stubHelper.putState('CAR' + i, car);
            this.logger.info('Added <--> ', car);
        }

    }

    async createCar(stubHelper: StubHelper, args: string[]) {
        Helpers.checkArgs(args, 5);

        let car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await stubHelper.putState(args[0], car);
    }

    async queryAllCars(stubHelper: StubHelper, args: string[]) {

        let startKey = 'CAR0';
        let endKey = 'CAR999';

        return await stubHelper.getStateByRangeAsList(startKey, endKey);

    }

    async changeCarOwner(stubHelper: StubHelper, args: string[]) {
        Helpers.checkArgs(args, 2);

        let car = await stubHelper.getStateAsObject(args[0]);

        car.owner = args[1];

        await stubHelper.putState(args[0], car);
    }
}