import { atom } from 'recoil';

export const callFunctionAtom = atom({
  key: 'callFunctionAtom',
  default: null,
});

export const callWalletAtom = atom({
  key: 'callWalletAtom',
  default: null,
});

export const callWalletRefresh = atom({
  key: 'callWalletRefresh',
  default: null,
});

// export const myFunctionAtom = atom({
//   key: 'myFunction',
//   default: () => {}, // initial value is an empty function
// });



