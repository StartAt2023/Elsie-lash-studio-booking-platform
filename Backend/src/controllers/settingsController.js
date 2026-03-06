import Settings from "../models/Settings.js";

const DEFAULT_KEY = "main";

async function getOrCreate() {
  let doc = await Settings.findOne({ key: DEFAULT_KEY }).lean();
  if (!doc) {
    doc = await Settings.create({ key: DEFAULT_KEY });
    doc = doc.toObject ? doc.toObject() : doc;
  }
  return doc;
}

function toResponse(doc) {
  if (!doc) return null;
  return {
    businessHours: doc.businessHours ?? "",
    depositAmount: doc.depositAmount ?? 0,
    cancellationWindowHours: doc.cancellationWindowHours ?? 24,
    lateArrivalGraceMinutes: doc.lateArrivalGraceMinutes ?? 10,
    touchUpPolicyWindow: doc.touchUpPolicyWindow ?? "",
  };
}

export async function getSettings(req, res) {
  try {
    const doc = await getOrCreate();
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch settings" });
  }
}

export async function updateSettings(req, res) {
  try {
    const body = req.body;
    const updates = {};
    if (body.businessHours !== undefined) updates.businessHours = body.businessHours;
    if (body.depositAmount !== undefined) updates.depositAmount = Number(body.depositAmount);
    if (body.cancellationWindowHours !== undefined) updates.cancellationWindowHours = Number(body.cancellationWindowHours);
    if (body.lateArrivalGraceMinutes !== undefined) updates.lateArrivalGraceMinutes = Number(body.lateArrivalGraceMinutes);
    if (body.touchUpPolicyWindow !== undefined) updates.touchUpPolicyWindow = body.touchUpPolicyWindow;
    const doc = await Settings.findOneAndUpdate(
      { key: DEFAULT_KEY },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update settings" });
  }
}
