import { PACKAGES } from '../constants';

export const getPackages = async () => {
  const seen = new Set();
  return PACKAGES.filter((p) => {
    if (p.status === 'Inactive' || seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });
};

export const getPackageById = async (id) => {
  const list = await getPackages();
  return list.find((p) => p.id === id) || null;
};
