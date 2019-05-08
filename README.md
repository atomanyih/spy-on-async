# spy-on-async

## Installation

```bash
npm install --save spy-on-async
```

## Usage

Designed to be used with jest.

### spying on a method

```js
// src/methodUnderTest.js
import ModuleWithAsyncStuff from './ModuleWithAsyncStuff'; 

const methodUnderTest = async (someArg) => {
  const result1 = await ModuleWithAsyncStuff.method1(someArg);
  const result2 = await ModuleWithAsyncStuff.method2(result1);
  return result2;
}

export default methodUnderTest;
```

```js
// __tests__/methodUnderTest.test.js
import methodUnderTest from '../src/methodUnderTest';
import ModuleWithAsyncStuff from '../src/ModuleWithAsyncStuff'; 

describe('methodUnderTest', () => {
  it('calls some methods', async () => {
    spyOnAsync(ModuleWithAsyncStuff, 'method1');
    spyOnAsync(ModuleWithAsyncStuff, 'method2');
    
    const promise = methodUnderTest('arg1');
    
    expect(ModuleWithAsyncStuff.method1).toHaveBeenCalledWith('arg1');
    
    await ModuleWithAsyncStuff.method1.mock.resolve('result1'); 
    // awaiting ensures the method continues execution before we do our next assertion
    
    expect(ModuleWithAsyncStuff.method2).toHaveBeenCalledWith('result1');
    
    await ModuleWithAsyncStuff.method2.mock.resolve('result2');
    
    expect(await promise).toEqual('result2');
  });
});
```

#### testing branching possibilities
```js
// __tests__/methodUnderTest.test.js
import methodUnderTest from '../src/methodUnderTest';
import ModuleWithAsyncStuff from '../src/ModuleWithAsyncStuff'; 

describe('methodUnderTest', () => {
  let promise;

  beforeEach(() => {
    spyOnAsync(ModuleWithAsyncStuff, 'method1');
    spyOnAsync(ModuleWithAsyncStuff, 'method2');
    
    promise = methodUnderTest('arg1');
  });

  it('calls some method1', async () => {
    expect(ModuleWithAsyncStuff.method1).toHaveBeenCalledWith('arg1');
  });
  
  describe('when method1 resolves', () => {
    beforeEach(() => {    
      await ModuleWithAsyncStuff.method1.mock.resolve('result1'); 
    });
  
    it('calls method2 with result', async () => {
      expect(ModuleWithAsyncStuff.method2).toHaveBeenCalledWith('result1');
    });
  });
  
  describe('when method1 rejects', async () => {
    beforeEach(() => {
      await ModuleWithAsyncStuff.method1.mock.reject('nooo');
    });
    
    it('does something', () => {});
  });
});
```

