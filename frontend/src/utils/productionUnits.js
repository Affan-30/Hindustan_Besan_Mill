// Mirrors backend/utils/productionUnits.js — kept in sync manually since
// frontend and backend are separate deployables.
export const DAL_CATEGORIES = ["Chana Dal", "Watana Dal", "Other"];

export const BESAN_BAG_SIZES = { small: 10, large: 30 };
export const JADA_BESAN_BAG_SIZE = 50;
export const CHUNNI_BAG_SIZE = 50;

export const computeProductionKg = ({
  besanBags10Kg = 0,
  besanBags30Kg = 0,
  jadaBesanBags50Kg = 0,
  chunniBags50Kg = 0,
} = {}) => ({
  totalBesanKg: Number(besanBags10Kg || 0) * BESAN_BAG_SIZES.small + Number(besanBags30Kg || 0) * BESAN_BAG_SIZES.large,
  jadaBesanKg: Number(jadaBesanBags50Kg || 0) * JADA_BESAN_BAG_SIZE,
  chunniKg: Number(chunniBags50Kg || 0) * CHUNNI_BAG_SIZE,
});
