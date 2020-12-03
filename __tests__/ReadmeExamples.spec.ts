import {AsyncSpy, spyOnAsync} from "../src";

describe('makeBananaBread', () => {
  const SomeGuy = {
    goBuyBananas: (location: string, numBananas: number) => Promise.reject("don't call me"),
    bakeBananaBread: (numBananas: number) => Promise.reject("don't call me")
  };

  const makeBananaBread = async (numBananas: number) => {
    let bananas;
    try {
      bananas = await SomeGuy.goBuyBananas('bananaTown', numBananas);
    } catch (e) {
      bananas = await SomeGuy.goBuyBananas('bananapolis', numBananas);
    }
    return SomeGuy.bakeBananaBread(bananas);
  };

  let promise: Promise<string>;
  let goBuyBananasSpy: AsyncSpy<string[]>;
  let bakeBananaBreadSpy: AsyncSpy<string[]>;

  beforeEach(() => {
    goBuyBananasSpy = spyOnAsync(SomeGuy, 'goBuyBananas');
    bakeBananaBreadSpy = spyOnAsync(SomeGuy, 'bakeBananaBread');

    promise = makeBananaBread(2);
  });

  it('goes to bananaTown for bananas', async () => {
    expect(SomeGuy.goBuyBananas).toHaveBeenCalledWith('bananaTown', 2);
  });

  describe('if bananaTown has bananas', () => {
    beforeEach(async () => {
      await goBuyBananasSpy.mockResolveNext(['banana', 'banana']);

      // // alternately, you can cast to an AsyncMock:
      // // if anyone can explain why I need to cast as jest.Mock before casting to AsyncMock, I will give you a hug
      // await ((SomeGuy.goBuyBananas as jest.Mock) as AsyncMock).mockResolveNext(['banana', 'banana'])

    });

    it('bakes those bananas', async () => {
      expect(SomeGuy.bakeBananaBread).toHaveBeenCalledWith(['banana', 'banana']);
    });
  });

  describe('if bananaTown is out of bananas', () => {
    beforeEach(async () => {
      await goBuyBananasSpy.mockRejectNext('no bananas');
    });

    it('goes to bananapolis ', () => {
      expect(SomeGuy.goBuyBananas).toHaveBeenCalledWith('bananapolis', 2);
    });

    describe('if bananapolis has bananas', () => {
      beforeEach(async () => {
        await goBuyBananasSpy.mockResolveNext(['banana', 'banana']);
      });

      it('bakes those bananas', async () => {
        expect(SomeGuy.bakeBananaBread).toHaveBeenCalledWith(['banana', 'banana']);
      });
    });

    describe('if bananapolis is out of bananas', () => {
      beforeEach(async () => {
        await goBuyBananasSpy.mockRejectNext('no bananas');
      });

      it('is sad', async () => {
        await expect(promise).rejects.toMatch('no bananas')
      });
    });
  });
});

describe('spyOnAsync example', () => {
  type Banana = string;
  type BananaBread = string;

  const BananaMan = {
    goBuyBananas: (numBananas: number): Promise<Banana[]> => Promise.reject('broken'),
    bakeBananaBread: (bananas: Banana[]): Promise<BananaBread> => Promise.reject('broken'),
  }

  const makeBananaBread = async (numBananas: number) => {
    const bananas = await BananaMan.goBuyBananas(numBananas);

    return BananaMan.bakeBananaBread(bananas);
  };

  describe('simple example', () => {
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
  });

  describe('branching example', () => {
    describe('makeBananaBread', () => {
      let promise: Promise<BananaBread>;
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
          // make sure to catch the promise or you will get unhandled promise warnings
          await expect(promise).rejects.toBeDefined();

          expect(BananaMan.bakeBananaBread).not.toHaveBeenCalled();
        });
      });
    });
  });
});