[![Build Status](https://travis-ci.org/wearetheledger/fabric-node-chaincode-utils.svg?branch=master)](https://travis-ci.org/wearetheledger/fabric-node-chaincode-utils)
# fabric-node-chaincode-utils
A Node.js module that helps to build your Hyperledger Fabric nodejs chaincode

- [docs](https://wearetheledger.github.io/fabric-node-chaincode-utils)
- [example usage](https://github.com/wearetheledger/fabric-network-boilerplate/tree/master/chaincode/node)

## Table of contents
- [Installation](#installation)
- [Writing chaincode](#writing-chaincode)
- [Testing chaincode](#testing-chaincode)
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

The Chaincode base class also implements the `Invoke()` method, it will search in your class for existing chaincode methods with the function name your sent. It will also automatically wrap and serialize the reponse with `shim.success()` and `shim.error()`. You can just return the javascript object and it will do the rest. So for example, if we invoke our chaincode with function `queryCar`, the function below will be executed.

```javascript

export class MyChaincode extends Chaincode {

    async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        Helpers.checkArgs(args, 1);

        const carNumber = args[0];

        const car = txHelper.getStateAsObject(carNumber);

        if (!car) {
            throw new ChaincodeError('Car does not exist');
        }

        return car;
    }
}

```

### TransactionHelper [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_transactionhelper_.transactionhelper.html)

The TransactionHelper is a wrapper around the `fabric-shim` Stub. Its a helper to automatically serialize and deserialize data being saved/retreived.

#### Query by key

Returns an array of items matching the rich query
```javascript
async queryCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        Helpers.checkArgs(args, 1);

        let carNumber = args[0];

        const car = txHelper.getStateAsObject(carNumber);

        if (!car) {
            throw new ChaincodeError('Car does not exist');
        }

        return car;
    }
```

#### Query by range

```javascript
async queryAllCars(stub: Stub, txHelper: TransactionHelper, args: string[]) {

        const startKey = 'CAR0';
        const endKey = 'CAR999';

        return await txHelper.getStateByRangeAsList(startKey, endKey);
}
```
#### Creating

```javascript
async createCar(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.log('============= START : Create Car ===========');

        Helpers.checkArgs(args, 5);

        const car = {
            docType: 'car',
            make: args[1],
            model: args[2],
            color: args[3],
            owner: args[4]
        };

        await txHelper.putState(args[0], car);
        Helpers.log('============= END : Create Car ===========');
}
```

#### Updating object

```javascript
async changeCarOwner(stub: Stub, txHelper: TransactionHelper, args: string[]) {
        Helpers.checkArgs(args, 2);

        let car = await txHelper.getStateAsObject(args[0]);

        car.owner = args[1];

        await txHelper.putState(args[0], car);
}
```

### Transform [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_utils_datatransform_.transform.html)

The Transform class is a helper to provide data transformation to and from the formats required by hyperledger fabric.


## Testing chaincode 
### ChaincodeMockStub [View definition](https://wearetheledger.github.io/fabric-node-chaincode-utils/classes/_mocking_chaincodemockstub_.chaincodemockstub.html)
This ChaincodeMockStub is a Mock implementation of the fabric-shim stub. This means you can test your chaincode without actually starting your network. 

Examples are located at [examples/tests](examples/tests)

**!! Following methods are not (yet) implemented and will not work !!**
- getHistoryForKey
- getBinding
- getTransient
- setEvent
- getChannelID

### How to test
Testing NodeJS chaincode works similarly to testing using the mockstub in the GOlang chaincode.

The **ChaincodeMockStub** has 2 important mock functions `mockInit`and `mockInvoke`. By passing your chaincode, it will mock a transaction and execute a invoke/init similarly to how it will originally be called.

Both the `mockInit`and the `mockInvoke` will return a [ChaincodeResponse](https://github.com/wearetheledger/fabric-shim-types/blob/4b8844769c2439303954d03f5c8a66dc0a795ed4/index.d.ts#L93). Using this ChaincodeResponse object, we can test whether or not the action returned an expected result.

On *success*, this response will look like this. If the method returns something, the reponse will also contain a `payload`.

```json
{
    "status": 200,
    "payload": <Buffer_with_your_data>
}
```

On *error*, this response will look like this.

```json
{
    "status": 200,
    "message": <Buffer_with_your_error_message>
}
```

You'll be able to validate the reponse using something like `chai`.

```javascript
// Validate reponse status
expect(response.status).to.eql(200)
// Validate payload - using `Transform.bufferToObject` because we recieve the payload as a buffer
expect(Transform.bufferToObject(response.payload).owner).to.eql("newOwner")
```

#### Include your chaincode
At the top of your test file, your can import and instantiate your chaincode, this only has to be done once.

```javascript
import { MyChaincode } from '../<path_to_your_chaincode_class>';

// You always need your chaincode so it knows which chaincode to invoke on
const chaincode = new MyChaincode();
```
#### Include the mockstub
After this, in your tests, you can create a new mockstub. You have to pass a random name (not that important) and your chaincode. It's up to you if you want to create a new mockstub for each test, which runs those tests with an empty state. Or use one for all the tests. If you reuse the same stub, you also reuse the previous tests state.

```javascript
import { ChaincodeMockStub, Transform } from "@theledger/fabric-chaincode-utils";

const stub = new ChaincodeMockStub("MyMockStub", chaincode);
```

#### Example

```javascript
import { MyChaincode } from '../MyChaincode';
import { ChaincodeMockStub, Transform } from "@theledger/fabric-chaincode-utils";

// You always need your chaincode so it knows which chaincode to invoke on
const chaincode = new MyChaincode();

describe('Test MyChaincode', () => {

    it("Should init without issues", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        // Your test code
    });
});
```

### Test Init
The `Init()`method can be tested using the `mockStub.mockInit(txId,args)`. It will create a new mock transaction and call the init method on your chaincode. Since the init happens when instantiating your chaincode, you generally don't want it to return anything. 

```javascript
import { MyChaincode } from '../MyChaincode';
import { ChaincodeMockStub, Transform } from "@theledger/fabric-chaincode-utils";

// You always need your chaincode so it knows which chaincode to invoke on
const chaincode = new MyChaincode();

describe('Test MyChaincode', () => {

    it("Should init without issues", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        const response = await stub.mockInit("tx1", []);

        expect(response.status).to.eql(200)
    });
});
```


## Contributing
 
1. Fork it! 🍴
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request 😁 🎉

## Credits

- [@Kunstmaan](https://github.com/Kunstmaan/hyperledger-fabric-node-chaincode-utils) for the initial idea and part of the util code.
- Developer - Jo ([@jestersimpps](https://github.com/@jestersimpps))
- Developer - Jonas ([@Superjo149](https://github.com/@Superjo149))
- Company - TheLedger ([theledger.be](https://theledger.be))

## License
The MIT License (MIT)

Copyright (c) 2018 TheLedger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
