import { spyOnAsync } from "../src";

const SomeGuy = {
  goBuyBananas: () => Promise.reject("don't call me"),
  bakeBananaBread: () => Promise.reject("don't call me")
};

const makeBananaBread = async (numBananas) => {
  let bananas;
  try {
    bananas = await SomeGuy.goBuyBananas('bananaTown', numBananas);
  } catch(e) {
    bananas = await SomeGuy.goBuyBananas('bananapolis', numBananas);
  }
  return SomeGuy.bakeBananaBread(bananas);
};

describe('makeBananaBread', () => {
  let promise;

  beforeEach(() => {
    spyOnAsync(SomeGuy, 'goBuyBananas');
    spyOnAsync(SomeGuy, 'bakeBananaBread');

    promise = makeBananaBread(2).catch(() => {});
  });

  it('goes to bananaTown for bananas', async () => {
    expect(SomeGuy.goBuyBananas).toHaveBeenCalledWith('bananaTown', 2);
  });

  describe('if bananaTown has bananas', () => {
    beforeEach(async () => {
      await SomeGuy.goBuyBananas.mock.resolve(['banana', 'banana']);
    });

    it('bakes those bananas', async () => {
      expect(SomeGuy.bakeBananaBread).toHaveBeenCalledWith(['banana', 'banana']);
    });
  });

  describe('if bananaTown is out of bananas', () => {
    beforeEach(async () => {
      await SomeGuy.goBuyBananas.mock.reject('no bananas');
    });

    it('goes to bananapolis ', () => {
      expect(SomeGuy.goBuyBananas).toHaveBeenCalledWith('bananapolis', 2);
    });

    describe('if bananapolis has bananas', () => {
      beforeEach(async () => {
        await SomeGuy.goBuyBananas.mock.resolve(['banana', 'banana']);
      });

      it('bakes those bananas', async () => {
        expect(SomeGuy.bakeBananaBread).toHaveBeenCalledWith(['banana', 'banana']);
      });
    });

    describe('if bananapolis is out of bananas', () => {
      beforeEach(async () => {
        await SomeGuy.goBuyBananas.mock.reject('no bananas');
      });

      it('is sad', () => {

      });
    });
  });
});