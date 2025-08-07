import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  tema: 'claro',
  idioma: 'es',
  zonaHoraria: 'Colombia - Bogotá',
  modoIA: 'amigable',
  notificacionesActivas: true,
  mostrarPQRS: true,

  setTema: (tema) => set({ tema }),
  setIdioma: (idioma) => set({ idioma }),
  setZonaHoraria: (zonaHoraria) => set({ zonaHoraria }),
  setModoIA: (modoIA) => set({ modoIA }),
  setNotificacionesActivas: (estado) => set({ notificacionesActivas: estado }),
  setMostrarPQRS: (estado) => set({ mostrarPQRS: estado }),
}));
