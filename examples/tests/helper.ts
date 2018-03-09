/* tslint:disable */

import { ChaincodeReponse } from 'fabric-shim';
import { expect } from 'chai';
import { ChaincodeMockStub, Transform } from '@theledger/fabric-mock-stub';

export interface InvokeObject {
    fcn: string;
    args: string[];
}

export interface QueryObject {
    fcn: string;
    args: string[];
    expected: any;
}

export interface ChainMethod {
    itShouldInvoke: string;
    invoke: InvokeObject;
    itShouldQuery: string;
    query: QueryObject;
}

export class TestHelper {

    static async runTests(chainCode: any, chainMethods: ChainMethod[]) {

        const stub: ChaincodeMockStub = new ChaincodeMockStub('mock', chainCode);

        describe('Test Chaincode using Helper', () => {
            chainMethods.forEach(chainMethod => {
                it(chainMethod.itShouldInvoke, async () => {
                    await this.invoke(stub, chainMethod.invoke);
                });
                it(chainMethod.itShouldQuery, async () => {
                    await this.query(stub, chainMethod.query);
                });
            })
        });
    }

    static async invoke(stub: ChaincodeMockStub, invokeObject: InvokeObject) {
        const response: ChaincodeReponse = await stub.mockInvoke('test', [invokeObject.fcn].concat(invokeObject.args));
        expect(response.status).to.eq(200);
    }


    static async query(stub: ChaincodeMockStub, queryObject: QueryObject) {
        const response: ChaincodeReponse = await stub.mockInvoke('test', [queryObject.fcn].concat(queryObject.args))
        expect(Transform.bufferToObject(response.payload)).to.deep.equal(queryObject.expected);
    }

}