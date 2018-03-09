[![Build Status](https://travis-ci.org/wearetheledger/fabric-node-chaincode-utils.svg?branch=master)](https://travis-ci.org/wearetheledger/fabric-node-chaincode-utils)
# fabric-node-chaincode-utils
A Nodejs module that helps you build your Hyperledger Fabric nodejs chaincode. Testing is done using the [fabric-mock-stub](github.com/wearetheledger/fabric-mock-stub).

- [docs](https://wearetheledger.github.io/fabric-node-chaincode-utils)
- [example usage](https://github.com/wearetheledger/fabric-network-boilerplate/tree/master/chaincode/node)

## Table of contents
- [Installation](#installation)
- [Writing chaincode](#writing-chaincode)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation 
```sh
yarn add @theledger/fabric-chaincode-utils
```

## Writing chaincode
An example implementation of this chaincode is located at [examples/MyChaincode.ts](examples/MyChaincode.ts)

### Chaincode [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_chaincode_.chaincode.html)
The Chaincode class is a base class containing handlers for the `Invoke()` and `Init()` function which are required by `fabric-shim`. The `Init()` function can be overwritten by just implementing it in your MyChaincode class.

```javascript
export class MyChaincode extends Chaincode {

    async Init(stub: Stub) {
      return 'this will override the init method in Chaincode';
    }
}
```

The Chaincode base class also implements the `Invoke()` method, it will search in your class for existing chaincode methods with the function name your sent. It will also automatically wrap and serialize the reponse with `shim.success()` and `shim.error()`. You can just return the javascript object and it will do the rest, **BUT** returning a Buffer is still supported aswell. So for example, if we invoke our chaincode with function `queryCar`, the function below will be executed.

```javascript

export class MyChaincode extends Chaincode {

    async queryCar(stubHelper: StubHelper, args: string[]): Promise<any> {

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
    
}

```

### StubHelper [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_stubhelper_.stubhelper.html)

The StubHelper is a wrapper around the `fabric-shim` Stub. Its a helper to automatically serialize and deserialize data being saved/retreived.

#### Query by key

Returns an array of items matching the rich query
```javascript
async queryCar(stubHelper: StubHelper, args: string[]): Promise<any> {

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
```

#### Query by range

```javascript
async queryAllCars(stubHelper: StubHelper, args: string[]): Promise<any> {

        const startKey = 'CAR0';
        const endKey = 'CAR999';

        return await stubHelper.getStateByRangeAsList(startKey, endKey);
}
```
#### Creating

```javascript
async createCar(stubHelper: StubHelper, args: string[]) {
        const verifiedArgs = await Helpers.checkArgs<any>(args, Yup.object()
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
```

#### Updating object

```javascript
async changeCarOwner(stubHelper: StubHelper, args: string[]) {

        const verifiedArgs = await Helpers.checkArgs<{ key: string; owner: string }>(args, Yup.object()
            .shape({
                key: Yup.string().required(),
                owner: Yup.string().required(),
            }));

        let car = await <any>stubHelper.getStateAsObject(verifiedArgs.key);

        car.owner = verifiedArgs.owner;

        await stubHelper.putState(verifiedArgs.key, car);
}
```

### Transform [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_utils_datatransform_.transform.html)

The Transform class is a helper to provide data transformation to and from the formats required by hyperledger fabric.

## Contributing
 
1. Fork it! 🍴
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request 😁 🎉

## Credits

- [@Kunstmaan](https://github.com/Kunstmaan/hyperledger-fabric-node-chaincode-utils) for the initial idea and part of the util code.
- Developer - Jo ([@jestersimpps](https://github.com/jestersimpps))
- Developer - Jonas ([@Superjo149](https://github.com/Superjo149))
- Company - TheLedger ([theledger.be](https://theledger.be))

## License
The MIT License (MIT)

Copyright (c) 2018 TheLedger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
