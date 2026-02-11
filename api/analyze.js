// Vercel Serverless Function: Claude Vision Postural Analysis
// POST /api/analyze
// Body: { images: [{ type: "front"|"left"|"right"|"back", data: "base64..." }] }

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { images } = req.body;
  if (!images || !images.length) return res.status(400).json({ error: "No images provided" });

  // Build the content array with images and prompt
  const content = [];

  // Add each image with its label
  const labelMap = { front: "FRONT VIEW", left: "LEFT SIDE VIEW", right: "RIGHT SIDE VIEW", back: "BACK VIEW" };
  images.forEach((img) => {
    content.push({ type: "text", text: `--- ${labelMap[img.type] || img.type.toUpperCase()} ---` });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType || "image/jpeg",
        data: img.data,
      },
    });
  });

  // The analysis prompt
  content.push({
    type: "text",
    text: `You are an expert STOTT PILATES® postural analysis specialist. Analyze these photos and identify ALL observable postural deviations.

For each finding, return the exact checkbox ID from the list below, plus R/L side info where applicable.

SIDE VIEW options (use LEFT SIDE VIEW and RIGHT SIDE VIEW photos):
- sv_ankle_neutral (R/L) | sv_ankle_plantar_flexed (R/L) | sv_ankle_dorsiflexed (R/L)
- sv_knee_neutral (R/L) | sv_knee_hyperextended (R/L) | sv_knee_flexed (R/L)
- sv_hip_neutral (R/L) | sv_hip_flexed (R/L) | sv_hip_extended (R/L)
- sv_pelvis_neutral (R/L) | sv_pelvis_anterior_tilt (R/L) | sv_pelvis_posterior_tilt (R/L)
- sv_lumbar_neutral | sv_lumbar_flat | sv_lumbar_excessive
- sv_lt_neutral | sv_lt_flat | sv_lt_excessive
- sv_ut_neutral | sv_ut_flat | sv_ut_excessive
- sv_cervical_neutral | sv_cervical_flat | sv_cervical_excessive
- sv_head_neutral | sv_head_forward | sv_head_retracted

FRONT VIEW options (use FRONT VIEW photo):
- fv_feet_neutral (R/L) | fv_feet_inverted (R/L) | fv_feet_everted (R/L)
- fv_knees_neutral | fv_knees_knock | fv_knees_bow
- fv_pelvis_level | fv_pelvis_elevated (R/L) | fv_pelvis_rotated_cw | fv_pelvis_rotated_ccw
- fv_rib_neutral | fv_rib_elevated (R/L) | fv_rib_shifted (R/L) | fv_rib_rotated_cw | fv_rib_rotated_ccw
- fv_shoulder_level | fv_shoulder_elevated (R/L) | fv_shoulder_depressed (R/L)
- fv_head_neutral | fv_head_rotated_cw | fv_head_rotated_ccw | fv_head_tilted (R/L) | fv_head_shifted (R/L)

BACK VIEW options (use BACK VIEW photo):
- bv_feet_neutral (R/L) | bv_feet_inverted (R/L) | bv_feet_everted (R/L)
- bv_femur_neutral (R/L) | bv_femur_medial (R/L) | bv_femur_lateral (R/L)
- bv_pelvis_level | bv_pelvis_elevated (R/L) | bv_pelvis_rotated_cw | bv_pelvis_rotated_ccw
- bv_scap_neutral (R/L) | bv_scap_protracted (R/L) | bv_scap_retracted (R/L) | bv_scap_elevated (R/L) | bv_scap_depressed (R/L) | bv_scap_upward_rot (R/L) | bv_scap_downward_rot (R/L) | bv_scap_winging (R/L) | bv_scap_ant_tipped (R/L)
- bv_humeri_neutral (R/L) | bv_humeri_medial (R/L)
- bv_spine_flat_areas | bv_spine_imbalances

RULES:
1. For each body region, select exactly ONE option (the most accurate observation)
2. For (R/L) items: specify which side(s) are affected. If both sides show the same deviation, include both.
3. If a region appears neutral/normal, select the neutral option.
4. Only include findings you can reasonably observe. Skip regions that are obscured by clothing.
5. Be conservative — only flag clear deviations, not borderline cases.
6. If a photo for a view is not provided, skip that view's findings.

Return ONLY valid JSON, no markdown, no explanation:
{
  "findings": [
    { "id": "sv_pelvis_anterior_tilt", "sides": ["R", "L"], "confidence": "high" },
    { "id": "sv_lumbar_excessive", "sides": [], "confidence": "medium" },
    { "id": "fv_shoulder_elevated", "sides": ["R"], "confidence": "high" }
  ],
  "summary": "Brief 2-3 sentence summary of major findings"
}`,
  });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return res.status(response.status).json({ error: "AI analysis failed", details: err });
    }

    const data = await response.json();
    const text = data.content.map((c) => (c.type === "text" ? c.text : "")).join("");

    // Parse JSON from response (strip any markdown fences)
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ error: "Analysis failed", message: err.message });
  }
}
