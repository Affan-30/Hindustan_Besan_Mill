import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },

    // Which dal this production batch was made from.
    dalCategory: { type: String, enum: ["Chana Dal", "Watana Dal", "Other"], required: true },

    // Besan is packed and counted in 10kg and 30kg bags.
    besanBags10Kg: { type: Number, default: 0, min: 0 },
    besanBags30Kg: { type: Number, default: 0, min: 0 },
    // Derived: besanBags10Kg * 10 + besanBags30Kg * 30. Stored (not virtual) so
    // existing aggregations/reports that sum totalBesanKg keep working unchanged.
    totalBesanKg: { type: Number, default: 0, min: 0 },

    // Jada Besan and Chunni are packed and counted in 50kg bags.
    jadaBesanBags50Kg: { type: Number, default: 0, min: 0 },
    jadaBesanKg: { type: Number, default: 0, min: 0 }, // derived: jadaBesanBags50Kg * 50

    chunniBags50Kg: { type: Number, default: 0, min: 0 },
    chunniKg: { type: Number, default: 0, min: 0 }, // derived: chunniBags50Kg * 50

    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// One production entry per (date, dal category) — this lets you log Chana Dal
// and Watana Dal production separately for the same day. Saving again for a
// date+category that already has a record updates it instead of duplicating.
productionSchema.index({ date: 1, dalCategory: 1 }, { unique: true });

export default mongoose.model("Production", productionSchema);