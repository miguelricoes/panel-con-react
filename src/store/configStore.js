import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  tema: 'oscuro',
  idioma: 'es',
  notificacionesActivas: true,
  mostrarPQRS: true,

  setTema: (tema) => set({ tema }),
  setIdioma: (idioma) => set({ idioma }),
  setNotificacionesActivas: (estado) => set({ notificacionesActivas: estado }),
  setMostrarPQRS: (estado) => set({ mostrarPQRS: estado }),
}));
