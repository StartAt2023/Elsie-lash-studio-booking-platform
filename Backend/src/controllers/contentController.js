import Content from "../models/Content.js";

const DEFAULT_KEY = "site";

async function getOrCreate() {
  let doc = await Content.findOne({ key: DEFAULT_KEY }).lean();
  if (!doc) {
    doc = await Content.create({ key: DEFAULT_KEY });
    doc = doc.toObject ? doc.toObject() : doc;
  }
  return doc;
}

function toResponse(doc) {
  if (!doc) return null;
  return {
    aboutText: doc.aboutText ?? "",
    certificateUrls: doc.certificateUrls ?? [],
    policies: doc.policies ?? {
      bookingDeposits: "",
      cancellationReschedule: "",
      noShow: "",
      lateArrival: "",
      refundSatisfaction: "",
      prepRequirements: "",
      aftercare: "",
      allergies: "",
      privacy: "",
    },
  };
}

export async function getContent(req, res) {
  try {
    const doc = await getOrCreate();
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch content" });
  }
}

export async function updateContent(req, res) {
  try {
    const body = req.body;
    const updates = {};
    if (body.aboutText !== undefined) updates.aboutText = body.aboutText;
    if (Array.isArray(body.certificateUrls)) updates.certificateUrls = body.certificateUrls;
    if (body.policies && typeof body.policies === "object") {
      updates.policies = body.policies;
    }
    const doc = await Content.findOneAndUpdate(
      { key: DEFAULT_KEY },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update content" });
  }
}
