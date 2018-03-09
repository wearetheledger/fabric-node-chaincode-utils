import { Helpers } from '../src/utils/helpers';
import { ChaincodeReponse } from 'fabric-shim';
import { Chaincode } from '../src/Chaincode';
import { ChaincodeError } from '../src/ChaincodeError';
import { StubHelper } from '../src/StubHelper';
import * as Yup from 'yup';

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

        const verifiedArgs = await Helpers.checkArgs<{ key: string }>(args, Yup.object()
            .shape({
                key: Yup.string().required(),
            }));

        const car = stubHelper.getStateAsObject(verifiedArgs.key); //get the car from chaincode state

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
        const verifiedArgs = await Helpers.checkArgs<{ key: string; }>(args, Yup.object()
            .shape({
                key: Yup.string().required(),
                make: Yup.string().required(),
                model: Yup.string().required(),
                color: Yup.string().required(),
                owner: Yup.string().required(),
            }));

        let car = {
            docType: 'car',
            make: verifiedArgs.make,
            model: verifiedArgs.model,
            color: verifiedArgs.color,
            owner: verifiedArgs.owner
        };

        await stubHelper.putState(verifiedArgs.key, car);
    }

    async queryAllCars(stubHelper: StubHelper, args: string[]) {

        const startKey = 'CAR0';
        const endKey = 'CAR999';

        return await stubHelper.getStateByRangeAsList(startKey, endKey);

    }

    async changeCarOwner(stubHelper: StubHelper, args: string[]) {

        const verifiedArgs = await Helpers.checkArgs<{ key: string; owner: string }>(args, Yup.object()
            .shape({
                key: Yup.string().required(),
                owner: Yup.string().required(),
            }));

        let car = await stubHelper.getStateAsObject(verifiedArgs.key);

        car.owner = verifiedArgs.owner;

        await stubHelper.putState(verifiedArgs.key, car);
    }
}