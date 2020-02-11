# spy-on-async

## Installation

```bash
npm install --save-dev spy-on-async
```

## Usage

Designed to be used with jest.

### spying on a method

```js
// src/makeBananaBread.js
import ModuleWithAsyncStuff from './ModuleWithAsyncStuff'; 

const makeBananaBread = async (numBananas) => {
  const bananas = await ModuleWithAsyncStuff.goBuyBananas(numBananas);
  const bananaBread = await ModuleWithAsyncStuff.bakeBananaBread(bananas);
  return bananaBread;
}

export default makeBananaBread;
```

```js
// __tests__/makeBananaBread.test.js
import makeBananaBread from '../src/makeBananaBread';
import ModuleWithAsyncStuff from '../src/ModuleWithAsyncStuff'; 

describe('makeBananaBread', () => {
  it('calls some methods', async () => {
    spyOnAsync(ModuleWithAsyncStuff, 'goBuyBananas');
    spyOnAsync(ModuleWithAsyncStuff, 'bakeBananaBread');
    
    const promise = makeBananaBread(2);
    
    expect(ModuleWithAsyncStuff.goBuyBananas).toHaveBeenCalledWith(2);
    
    await ModuleWithAsyncStuff.goBuyBananas.mock.resolve('bananas'); 
    // awaiting ensures the method continues execution before we do our next assertion
    
    expect(ModuleWithAsyncStuff.bakeBananaBread).toHaveBeenCalledWith('bananas');
    
    await ModuleWithAsyncStuff.bakeBananaBread.mock.resolve('banana bread');
    
    expect(await promise).toEqual('banana bread');
  });
});
```

#### testing branching possibilities
```js
// __tests__/makeBananaBread.test.js
import makeBananaBread from '../src/makeBananaBread';
import ModuleWithAsyncStuff from '../src/ModuleWithAsyncStuff'; 

describe('makeBananaBread', () => {
  let promise;

  beforeEach(() => {
    spyOnAsync(ModuleWithAsyncStuff, 'goBuyBananas');
    spyOnAsync(ModuleWithAsyncStuff, 'bakeBananaBread');
    
    promise = makeBananaBread('arg1');
  });

  it('buys some bananas', async () => {
    expect(ModuleWithAsyncStuff.goBuyBananas).toHaveBeenCalledWith('arg1');
  });
  
  describe('when store has bananas', () => {
    beforeEach(() => {    
      await ModuleWithAsyncStuff.goBuyBananas.mock.resolve('bananas'); 
    });
  
    it('bakes those bananas', async () => {
      expect(ModuleWithAsyncStuff.bakeBananaBread).toHaveBeenCalledWith('bananas');
    });
  });
  
  describe('when store is out of bananas', async () => {
    beforeEach(() => {
      await ModuleWithAsyncStuff.goBuyBananas.mock.reject('no bananas');
    });
    
    it('does something', () => {});
  });
});
```

