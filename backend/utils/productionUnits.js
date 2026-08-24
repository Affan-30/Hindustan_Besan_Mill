// Bag sizes used for packing mill production.
// Besan is packed in 10kg and 30kg bags; Jada Besan and Chunni in 50kg bags.
export const BESAN_BAG_SIZES = { small: 10, large: 30 };
export const JADA_BESAN_BAG_SIZE = 50;
export const CHUNNI_BAG_SIZE = 50;

export const DAL_CATEGORIES = ["Chana Dal", "Watana Dal", "Other"];

export const computeProductionKg = ({
  besanBags10Kg = 0,
  besanBags30Kg = 0,
  jadaBesanBags50Kg = 0,
  chunniBags50Kg = 0,
}) => ({
  totalBesanKg: Number(besanBags10Kg) * BESAN_BAG_SIZES.small + Number(besanBags30Kg) * BESAN_BAG_SIZES.large,
  jadaBesanKg: Number(jadaBesanBags50Kg) * JADA_BESAN_BAG_SIZE,
  chunniKg: Number(chunniBags50Kg) * CHUNNI_BAG_SIZE,
});
