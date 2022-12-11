import { atom } from 'recoil'
export const chatState = atom({
    key: 'chatState',
    default: {
        users: [],
        message: [],
    }
});