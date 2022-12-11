import { atom } from 'recoil'
export const appState = atom({
    key: 'appState',
    default: {
        loaded: false,
        user: {},
        rooms: []
    }
});