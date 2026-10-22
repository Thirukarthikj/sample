import { CAB_EXTENDED, CAB } from '../constants';

export const getVehicles = async () => {
  return CAB_EXTENDED || CAB || [];
};
