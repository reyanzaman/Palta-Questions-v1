import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    auth : {
        username: '',
        active : false
    },
    setUsername: (name) => set((state) => ({ auth : { ...state.auth, username : name }})),
}))

export const useDataStore = create((set) => ({
    data: null,
    setData: (newData) => set(() => ({ data: newData })),
}));

export const useDetailStore = create((set) => ({
    detail: null,
    setDetail: (newDetail) => set(() => ({ detail: newDetail })),
}));