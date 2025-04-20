import {Preview} from '../types/preview';
import {Favourite} from '../types/favourite';

export const sortPreview = (data: Preview[], option: string): Preview[] => {
  switch (option) {
    case 'A-Z':
      return [...data].sort((a, b) => a.title.localeCompare(b.title));
    case 'Z-A':
      return [...data].sort((a, b) => b.title.localeCompare(a.title));
    case 'Most Recent':
      return [...data].sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );
    case 'Oldest':
      return [...data].sort(
        (a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime()
      );
    default:
      return data;
  }
};

export const sortFavourite = (data: Favourite[], option: string): Favourite[] => {
  switch (option) {
    case 'A-Z':
      return [...data].sort((a, b) => a.title.localeCompare(b.title));
    case 'Z-A':
      return [...data].sort((a, b) => b.title.localeCompare(a.title));
    case 'Recently Added':
      return [...data].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    case 'Oldest':
      return [...data].sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      );
    default:
      return data;
  }
};