import {AsyncMock, AsyncSpy, spyOnAsync} from "../src";
import ArgsType = jest.ArgsType;

const SomeGuy = {
  goBuyBananas: (_: any, __:any) => Promise.reject("don't call me"),
  bakeBananaBread: (_: any) => Promise.reject("don't call me")
};

const makeBananaBread = async (numBananas: any) => {
  let bananas;
  try {
    bananas = await SomeGuy.goBuyBananas('bananaTown', numBananas);
  } catch(e) {
    bananas = await SomeGuy.goBuyBananas('bananapolis', numBananas);
  }
  return SomeGuy.bakeBananaBread(bananas);
};

describe('makeBananaBread', () => {
  let promise : Promise<string>;
  let goBuyBananasSpy : AsyncSpy<string[]>;
  let bakeBananaBreadSpy : AsyncSpy<string[]>;

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