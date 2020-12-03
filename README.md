# spy-on-async

## Installation

```bash
npm install --save-dev spy-on-async
```

## Usage

Designed to be used with jest.

### jest configuration

```
{
    "restoreMocks": true,
    "resetMocks": false, 
    "clearMocks": false,
}
```
`resetMocks` and `clearMocks` should be disabled by default.
 If they are enabled, this will remove the implementation from module mocks and make you sad.


### spying on a method

```js
// src/makeBananaBread.ts
import BananaMan from './BananaMan'; 

const makeBananaBread = async (numBananas: number) => {
  const bananas = await BananaMan.goBuyBananas(numBananas);

  return BananaMan.bakeBananaBread(bananas);
};

export default makeBananaBread;
```

```js
// __tests__/makeBananaBread.spec.ts
import makeBananaBread from '../src/makeBananaBread';
import BananaMan from '../src/BananaMan'; 

describe('makeBananaBread', () => {
  it('calls some methods', async () => {
    const goBuyBananasSpy = spyOnAsync(BananaMan, 'goBuyBananas');
    const bakeBananaBreadSpy = spyOnAsync(BananaMan, 'bakeBananaBread');
  
    spyOnAsync(BananaMan, 'bakeBananaBread');
  
    const promise = makeBananaBread(2);
  
    expect(BananaMan.goBuyBananas).toHaveBeenCalledWith(2);
  
    await goBuyBananasSpy.mockResolveNext('bananas');
    // awaiting ensures the method continues execution before we do our next assertion
  
    expect(BananaMan.bakeBananaBread).toHaveBeenCalledWith('bananas');
  
    await bakeBananaBreadSpy.mockResolveNext('banana bread');
  
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
  let promise : Promise<BananaBread>;
  let goBuyBananasSpy: AsyncSpy<Banana>;
  let bakeBananaBreadSpy: AsyncSpy<BananaBread>;
  
  beforeEach(() => {
    goBuyBananasSpy = spyOnAsync(BananaMan, 'goBuyBananas');
    bakeBananaBreadSpy = spyOnAsync(BananaMan, 'bakeBananaBread');
  
    promise = makeBananaBread(2);
  });
  
  it('buys some bananas', async () => {
    expect(BananaMan.goBuyBananas).toHaveBeenCalledWith(2);
  });
  
  describe('when store has bananas', () => {
    beforeEach(async () => {
      await goBuyBananasSpy.mockResolveNext('bananas');
    });
  
    it('bakes those bananas', async () => {
      expect(BananaMan.bakeBananaBread).toHaveBeenCalledWith('bananas');
    });
  });
  
  describe('when store is out of bananas', () => {
    beforeEach(async () => {
      await goBuyBananasSpy.mockRejectNext('no bananas');
    });
  
    it('does not bake them bananas', async () => {
      await expect(promise).rejects.toBeDefined()
      expect(BananaMan.bakeBananaBread).not.toHaveBeenCalled();
    });
  });
});
```

