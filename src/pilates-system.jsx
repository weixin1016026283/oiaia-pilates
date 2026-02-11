import { useState, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────
// STOTT Postural Analysis - Full R/L Structure
// Every item can be checked for Right and/or Left
// ─────────────────────────────────────────────

const POSTURAL_CHECKLIST = {
  sideView: {
    title: "侧面观",
    titleEn: "Side View",
    subtitle: "check both sides",
    icon: "👤",
    sections: [
      {
        name: "踝关节", nameEn: "Ankle Joints", key: "sv_ankle",
        options: [
          { id: "sv_ankle_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "sv_ankle_plantar_flexed", label: "跖屈", labelEn: "Plantar Flexed", hasRL: true },
          { id: "sv_ankle_dorsiflexed", label: "背屈", labelEn: "Dorsiflexed", hasRL: true },
        ],
      },
      {
        name: "膝关节", nameEn: "Knees", key: "sv_knees",
        options: [
          { id: "sv_knee_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "sv_knee_hyperextended", label: "过伸", labelEn: "Hyperextended", hasRL: true },
          { id: "sv_knee_flexed", label: "屈曲", labelEn: "Flexed", hasRL: true },
        ],
      },
      {
        name: "髋关节", nameEn: "Hip Joints", key: "sv_hip",
        options: [
          { id: "sv_hip_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "sv_hip_flexed", label: "屈曲", labelEn: "Flexed", hasRL: true },
          { id: "sv_hip_extended", label: "伸展", labelEn: "Extended", hasRL: true },
        ],
      },
      {
        name: "骨盆", nameEn: "Pelvis", key: "sv_pelvis",
        options: [
          { id: "sv_pelvis_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "sv_pelvis_anterior_tilt", label: "前倾", labelEn: "Anterior Pelvic Tilt", hasRL: true },
          { id: "sv_pelvis_posterior_tilt", label: "后倾", labelEn: "Posterior Pelvic Tilt", hasRL: true },
        ],
      },
      {
        name: "腰椎", nameEn: "Lumbar Spine", key: "sv_lumbar",
        options: [
          { id: "sv_lumbar_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "sv_lumbar_flat", label: "平坦（前凸减少）", labelEn: "Flat — decreased convex curve anteriorly", hasRL: false },
          { id: "sv_lumbar_excessive", label: "过度前凸", labelEn: "Excessive Extension — increased convex curve anteriorly", hasRL: false },
        ],
      },
      {
        name: "下胸椎", nameEn: "Lower Thoracic Spine", key: "sv_lower_thoracic",
        options: [
          { id: "sv_lt_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "sv_lt_flat", label: "平坦（后凸减少）", labelEn: "Flat — decreased convex curve posteriorly", hasRL: false },
          { id: "sv_lt_excessive", label: "过度后凸", labelEn: "Excessive Flexion — increased convex curve posteriorly", hasRL: false },
        ],
      },
      {
        name: "上胸椎", nameEn: "Upper Thoracic Spine", key: "sv_upper_thoracic",
        options: [
          { id: "sv_ut_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "sv_ut_flat", label: "平坦（后凸减少）", labelEn: "Flat — decreased convex curve posteriorly", hasRL: false },
          { id: "sv_ut_excessive", label: "过度后凸", labelEn: "Excessive Flexion — increased convex curve posteriorly", hasRL: false },
        ],
      },
      {
        name: "颈椎", nameEn: "Cervical Spine", key: "sv_cervical",
        options: [
          { id: "sv_cervical_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "sv_cervical_flat", label: "平坦（前凸减少）", labelEn: "Flat — decreased convex curve anteriorly", hasRL: false },
          { id: "sv_cervical_excessive", label: "过度前凸", labelEn: "Excessive Extension — increased convex curve anteriorly", hasRL: false },
        ],
      },
      {
        name: "头部", nameEn: "Head", key: "sv_head",
        options: [
          { id: "sv_head_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "sv_head_forward", label: "前伸", labelEn: "Forward", hasRL: false },
          { id: "sv_head_retracted", label: "后缩", labelEn: "Retracted", hasRL: false },
        ],
      },
    ],
  },
  frontView: {
    title: "正面观",
    titleEn: "Front View",
    subtitle: "* Confirm from back if necessary",
    icon: "🧍",
    sections: [
      {
        name: "足部", nameEn: "Feet", key: "fv_feet",
        options: [
          { id: "fv_feet_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "fv_feet_inverted", label: "内翻/旋后", labelEn: "Inverted / Supinated", hasRL: true },
          { id: "fv_feet_everted", label: "外翻/旋前", labelEn: "Everted / Pronated", hasRL: true },
        ],
      },
      {
        name: "膝关节", nameEn: "Knees", key: "fv_knees",
        options: [
          { id: "fv_knees_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "fv_knees_knock", label: "X型腿（膝外翻）", labelEn: "Knock-kneed — Genu Valgum", hasRL: false },
          { id: "fv_knees_bow", label: "O型腿（膝内翻）", labelEn: "Bow-legged — Genu Varum", hasRL: false },
        ],
      },
      {
        name: "骨盆", nameEn: "Pelvis", key: "fv_pelvis",
        options: [
          { id: "fv_pelvis_level", label: "水平", labelEn: "Level", hasRL: false, isNeutral: true },
          { id: "fv_pelvis_elevated", label: "抬高", labelEn: "Elevated", hasRL: true },
          { id: "fv_pelvis_rotated_cw", label: "顺时针旋转", labelEn: "Rotated Clockwise", hasRL: false },
          { id: "fv_pelvis_rotated_ccw", label: "逆时针旋转", labelEn: "Rotated Counter-clockwise", hasRL: false },
        ],
      },
      {
        name: "肋廓", nameEn: "Rib Cage", key: "fv_ribcage",
        options: [
          { id: "fv_rib_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "fv_rib_elevated", label: "抬高", labelEn: "Elevated", hasRL: true },
          { id: "fv_rib_shifted", label: "偏移", labelEn: "Shifted", hasRL: true },
          { id: "fv_rib_rotated_cw", label: "顺时针旋转", labelEn: "Rotated Clockwise", hasRL: false },
          { id: "fv_rib_rotated_ccw", label: "逆时针旋转", labelEn: "Rotated Counter-clockwise", hasRL: false },
        ],
      },
      {
        name: "肩部", nameEn: "Shoulders", key: "fv_shoulders",
        options: [
          { id: "fv_shoulder_level", label: "水平", labelEn: "Level", hasRL: false, isNeutral: true },
          { id: "fv_shoulder_elevated", label: "抬高", labelEn: "Elevated", hasRL: true },
          { id: "fv_shoulder_depressed", label: "下沉", labelEn: "Depressed", hasRL: true },
        ],
      },
      {
        name: "头部", nameEn: "Head", key: "fv_head",
        options: [
          { id: "fv_head_neutral", label: "中立位", labelEn: "Neutral", hasRL: false, isNeutral: true },
          { id: "fv_head_rotated_cw", label: "顺时针旋转", labelEn: "Rotated Clockwise", hasRL: false },
          { id: "fv_head_rotated_ccw", label: "逆时针旋转", labelEn: "Rotated Counter-clockwise", hasRL: false },
          { id: "fv_head_tilted", label: "倾斜", labelEn: "Tilted", hasRL: true },
          { id: "fv_head_shifted", label: "偏移", labelEn: "Shifted", hasRL: true },
        ],
      },
    ],
  },
  backView: {
    title: "背面观",
    titleEn: "Back View",
    icon: "🔙",
    sections: [
      {
        name: "足部", nameEn: "Feet", key: "bv_feet",
        options: [
          { id: "bv_feet_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "bv_feet_inverted", label: "内翻/旋后", labelEn: "Inverted / Supinated", hasRL: true },
          { id: "bv_feet_everted", label: "外翻/旋前", labelEn: "Everted / Pronated", hasRL: true },
        ],
      },
      {
        name: "股骨", nameEn: "Femurs", key: "bv_femurs",
        options: [
          { id: "bv_femur_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "bv_femur_medial", label: "内旋", labelEn: "Medial Rotation", hasRL: true },
          { id: "bv_femur_lateral", label: "外旋", labelEn: "Lateral Rotation", hasRL: true },
        ],
      },
      {
        name: "骨盆", nameEn: "Pelvis", key: "bv_pelvis",
        options: [
          { id: "bv_pelvis_level", label: "水平", labelEn: "Level", hasRL: false, isNeutral: true },
          { id: "bv_pelvis_elevated", label: "抬高", labelEn: "Elevated", hasRL: true },
          { id: "bv_pelvis_rotated_cw", label: "顺时针旋转", labelEn: "Rotated Clockwise", hasRL: false },
          { id: "bv_pelvis_rotated_ccw", label: "逆时针旋转", labelEn: "Rotated Counter-clockwise", hasRL: false },
        ],
      },
      {
        name: "肩胛骨", nameEn: "Scapulae", key: "bv_scapulae",
        options: [
          { id: "bv_scap_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "bv_scap_protracted", label: "前伸", labelEn: "Protracted", hasRL: true },
          { id: "bv_scap_retracted", label: "后缩", labelEn: "Retracted", hasRL: true },
          { id: "bv_scap_elevated", label: "抬高", labelEn: "Elevated", hasRL: true },
          { id: "bv_scap_depressed", label: "下沉", labelEn: "Depressed", hasRL: true },
          { id: "bv_scap_upward_rot", label: "上旋", labelEn: "Upwardly Rotated", hasRL: true },
          { id: "bv_scap_downward_rot", label: "下旋", labelEn: "Downwardly Rotated", hasRL: true },
          { id: "bv_scap_winging", label: "翼状", labelEn: "Winging", hasRL: true },
          { id: "bv_scap_ant_tipped", label: "前倾", labelEn: "Anteriorly Tipped", hasRL: true },
        ],
      },
      {
        name: "肱骨", nameEn: "Humeri", key: "bv_humeri",
        options: [
          { id: "bv_humeri_neutral", label: "中立位", labelEn: "Neutral", hasRL: true, isNeutral: true },
          { id: "bv_humeri_medial", label: "内旋", labelEn: "Medially Rotated", hasRL: true },
        ],
      },
      {
        name: "脊柱序列", nameEn: "Sequencing Through the Spine", key: "bv_spine_seq",
        options: [
          { id: "bv_spine_flat_areas", label: "侧面有平坦区域", labelEn: "Are there flat areas? (watch from side)", hasRL: false, hasNote: true, noteLabel: "位置 Where?", hasYN: true },
          { id: "bv_spine_imbalances", label: "背面有不对称", labelEn: "Are there any imbalances? (watch from back)", hasRL: false, hasNote: true, noteLabel: "位置 Where?", hasYN: true },
        ],
      },
    ],
  },
};

// ─── Reformer Exercise Database (48 exercises) ───
// Springs: R=Red(1.0) B=Blue(0.5) Y=Yellow(0.25) — STOTT Reformer
const REFORMER_EXERCISES = [
  { id: "breathing", name: "呼吸练习", nameEn: "Breathing", reps: "6", cat: "warmup", springs: "0.5–1.0", pos: "仰卧 Supine", dur: 3, muscles: ["膈肌 Diaphragm", "腹横肌 TrA", "盆底肌 Pelvic Floor"], targets: ["核心激活 Core Activation", "呼吸模式 Breathing Patterns"], level: 1 },
  { id: "imprint_release", name: "印记与释放", nameEn: "Imprint & Release", reps: "6", cat: "warmup", springs: "0.5–1.0", pos: "仰卧 Supine", dur: 3, muscles: ["腹横肌 TrA", "多裂肌 Multifidus", "盆底肌 Pelvic Floor"], targets: ["核心激活 Core Activation", "骨盆中立 Pelvic Neutral"], level: 1 },
  { id: "fw_parallel", name: "脚踏板-平行位", nameEn: "Footwork Parallel", reps: "10", cat: "footwork", springs: "3.0–4.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "腘绳肌 Hamstrings", "臀肌 Glutes", "小腿 Calves"], targets: ["下肢力线 Leg Alignment", "膝关节稳定 Knee Stability"], level: 1 },
  { id: "fw_v_pos", name: "脚踏板-V字位", nameEn: "Footwork V-Position", reps: "10", cat: "footwork", springs: "3.0–4.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "髋外旋肌 Hip External Rotators", "内收肌 Adductors", "臀肌 Glutes"], targets: ["髋外旋 Hip External Rotation", "下肢力线 Leg Alignment"], level: 1 },
  { id: "fw_wide", name: "脚踏板-宽V位", nameEn: "Footwork Open V", reps: "10", cat: "footwork", springs: "3.0–4.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "内收肌 Adductors", "臀肌 Glutes"], targets: ["髋关节稳定 Hip Stability", "内收肌激活 Adductor Activation"], level: 1 },
  { id: "fw_heels", name: "脚踏板-脚跟", nameEn: "Footwork Heels", reps: "10", cat: "footwork", springs: "3.0–4.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "胫骨前肌 Tibialis Anterior", "腘绳肌 Hamstrings"], targets: ["踝背屈 Ankle Dorsiflexion", "胫骨前肌激活 Tib Anterior Activation"], level: 1 },
  { id: "fw_toes", name: "脚踏板-脚尖", nameEn: "Footwork Toes / Relevé", reps: "10", cat: "footwork", springs: "3.0–4.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "小腿 Calves", "足内在肌 Foot Intrinsics"], targets: ["踝关节稳定 Ankle Stability", "小腿力量 Calf Strength", "足弓支撑 Arch Support"], level: 1 },
  { id: "prances", name: "踮脚交替", nameEn: "Prances", reps: "10", cat: "footwork", springs: "2.0–3.0", pos: "仰卧 Supine", dur: 3, muscles: ["小腿 Calves", "踝稳定肌 Ankle Stabilizers", "足内在肌 Foot Intrinsics"], targets: ["踝活动度 Ankle Mobility", "小腿柔韧 Calf Flexibility"], level: 1 },
  { id: "fw_single", name: "单腿脚踏板", nameEn: "Single Leg Footwork", reps: "10", cat: "footwork", springs: "2.0–3.0", pos: "仰卧 Supine", dur: 3, muscles: ["股四头肌 Quadriceps", "臀肌 Glutes", "髋稳定肌 Hip Stabilizers"], targets: ["左右对称 Bilateral Symmetry", "髋关节稳定 Hip Stability"], level: 2 },
  { id: "hundred", name: "百次呼吸", nameEn: "The Hundred", reps: "100", cat: "abdominal", springs: "2.0–3.0", pos: "仰卧 Supine", dur: 3, muscles: ["腹直肌 Rectus Abdominis", "腹横肌 TrA", "腹斜肌 Obliques", "髋屈肌 Hip Flexors"], targets: ["核心力量 Core Strength", "呼吸耐力 Breathing Endurance", "脊柱屈曲 Spinal Flexion"], level: 1 },
  { id: "coordination", name: "协调练习", nameEn: "Coordination", reps: "6", cat: "abdominal", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["腹直肌 Rectus Abdominis", "腹横肌 TrA", "髋屈肌 Hip Flexors", "内收肌 Adductors"], targets: ["核心力量 Core Strength", "动作协调 Motor Coordination"], level: 2 },
  { id: "obliques_supine", name: "仰卧斜肌旋转", nameEn: "Obliques Criss-Cross", reps: "6", cat: "abdominal", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["腹斜肌 Obliques", "腹横肌 TrA", "腹直肌 Rectus Abdominis"], targets: ["旋转力量 Rotational Strength", "核心稳定 Core Stability"], level: 2 },
  { id: "leg_circles", name: "腿画圈", nameEn: "Leg Circles (Straps)", reps: "6", cat: "hip_work", springs: "2.0–3.0", pos: "仰卧 Supine", dur: 3, muscles: ["髋屈肌 Hip Flexors", "内收肌 Adductors", "外展肌 Abductors", "髋旋转肌 Hip Rotators"], targets: ["髋活动度 Hip Mobility", "核心稳定 Core Stability"], level: 1 },
  { id: "frog", name: "蛙式", nameEn: "Frog", reps: "6", cat: "hip_work", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["内收肌 Adductors", "臀肌 Glutes", "髋外旋肌 Hip External Rotators"], targets: ["内收肌激活 Adductor Activation", "髋外展 Hip Opening", "骨盆稳定 Pelvic Stability"], level: 1 },
  { id: "leg_lowers", name: "抬腿与下放", nameEn: "Lift & Lower (Straps)", reps: "6", cat: "hip_work", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["髋屈肌 Hip Flexors", "腹横肌 TrA", "腹直肌 Rectus Abdominis"], targets: ["核心稳定 Core Stability", "骨盆控制 Pelvic Control"], level: 2 },
  { id: "openings", name: "开合腿", nameEn: "Openings (Abduction)", reps: "6", cat: "hip_work", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["外展肌 Abductors", "臀中肌 Gluteus Medius", "髋外旋肌 Hip External Rotators"], targets: ["髋关节稳定 Hip Stability", "臀肌激活 Glute Activation"], level: 2 },
  { id: "pelvic_curl", name: "髋部卷动", nameEn: "Hip Rolls / Pelvic Curl", reps: "6", cat: "spinal_art", springs: "2.0–3.0", pos: "仰卧 Supine", dur: 3, muscles: ["臀肌 Glutes", "腘绳肌 Hamstrings", "竖脊肌 Erector Spinae", "腹横肌 TrA"], targets: ["脊柱分节运动 Spinal Articulation", "臀肌力量 Glute Strength"], level: 1 },
  { id: "short_spine", name: "短脊柱按摩", nameEn: "Short Spine Massage", reps: "6", cat: "spinal_art", springs: "2.0", pos: "仰卧 Supine", dur: 4, muscles: ["竖脊肌 Erector Spinae", "腹肌 Abdominals", "腘绳肌 Hamstrings"], targets: ["脊柱分节运动 Spinal Articulation", "柔韧性 Flexibility"], level: 2 },
  { id: "semi_circle", name: "半圆", nameEn: "Semi Circle", reps: "6", cat: "spinal_art", springs: "2.0", pos: "仰卧 Supine", dur: 4, muscles: ["竖脊肌 Erector Spinae", "髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "腹肌 Abdominals"], targets: ["脊柱分节运动 Spinal Articulation", "髋屈肌拉伸 Hip Flexor Stretch"], level: 3 },
  { id: "arm_circles", name: "中背系列-画圈", nameEn: "Midback Series — Circles", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "仰卧 Supine", dur: 3, muscles: ["胸肌 Pectorals", "三角肌 Deltoids", "肩袖肌群 Rotator Cuff", "背阔肌 Latissimus Dorsi"], targets: ["肩活动度 Shoulder Mobility", "肩胛稳定 Scapular Stability"], level: 1 },
  { id: "arm_press", name: "中背系列-直推", nameEn: "Midback Series — Straight Down", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "仰卧 Supine", dur: 3, muscles: ["胸肌 Pectorals", "肱三头肌 Triceps", "前三角肌 Anterior Deltoid", "前锯肌 Serratus Anterior"], targets: ["胸肌力量 Pectoral Strength", "肩胛稳定 Scapular Stability"], level: 1 },
  { id: "bicep_curls", name: "划船准备-弯举", nameEn: "Back Rowing Preps — Biceps Curls", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "仰卧 Supine", dur: 2, muscles: ["肱二头肌 Biceps", "前三角肌 Anterior Deltoid", "核心 Core"], targets: ["上肢力量 Upper Limb Strength"], level: 1 },
  { id: "tricep_press", name: "中背系列-三头推", nameEn: "Midback Series — Triceps Press", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "仰卧/坐位 Supine/Seated", dur: 2, muscles: ["肱三头肌 Triceps", "核心 Core", "肩胛稳定肌 Scapular Stabilizers"], targets: ["上肢力量 Upper Limb Strength"], level: 1 },
  { id: "rowing_front", name: "前划船准备", nameEn: "Front Rowing Preps", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "坐位 Seated", dur: 3, muscles: ["菱形肌 Rhomboids", "中斜方肌 Middle Trapezius", "后三角肌 Posterior Deltoid", "核心 Core"], targets: ["上背力量 Upper Back Strength", "肩胛后缩 Scapular Retraction"], level: 2 },
  { id: "rowing_back", name: "后划船", nameEn: "Back Rowing", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "坐位 Seated", dur: 3, muscles: ["背阔肌 Latissimus Dorsi", "肱二头肌 Biceps", "核心 Core", "肩胛稳定肌 Scapular Stabilizers"], targets: ["背部力量 Back Strength"], level: 2 },
  { id: "hug_a_tree", name: "侧手臂-内收", nameEn: "Side Arm Preps — Hug a Tree", reps: "10", cat: "arm_work", springs: "0.5–1.0", pos: "仰卧/坐位 Supine/Seated", dur: 3, muscles: ["胸肌 Pectorals", "肱二头肌 Biceps", "前三角肌 Anterior Deltoid", "前锯肌 Serratus Anterior"], targets: ["胸肌力量 Pectoral Strength", "肩胛前引 Scapular Protraction"], level: 1 },
  { id: "salute", name: "敬礼", nameEn: "Salute", reps: "10", cat: "arm_work", springs: "1.0–2.0", pos: "仰卧/坐位 Supine/Seated", dur: 2, muscles: ["肱三头肌 Triceps", "三角肌 Deltoids", "核心 Core"], targets: ["肩关节稳定 Shoulder Stability"], level: 2 },
  { id: "elephant", name: "大象", nameEn: "Elephant", reps: "6", cat: "full_body", springs: "1.0–2.0", pos: "站立 Standing", dur: 3, muscles: ["腘绳肌 Hamstrings", "小腿 Calves", "核心 Core", "竖脊肌 Erector Spinae"], targets: ["腘绳肌柔韧 Hamstring Flexibility", "脊柱分节运动 Spinal Articulation"], level: 2 },
  { id: "knee_str_round", name: "跪姿伸展-圆背", nameEn: "Knee Stretches Round Back", reps: "6", cat: "full_body", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["核心 Core", "髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "腹肌 Abdominals"], targets: ["核心力量 Core Strength", "脊柱屈曲 Spinal Flexion"], level: 2 },
  { id: "knee_str_arch", name: "跪姿伸展-平背", nameEn: "Knee Stretches Straight Back", reps: "6", cat: "full_body", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["核心 Core", "髋屈肌 Hip Flexors", "竖脊肌 Erector Spinae", "股四头肌 Quadriceps"], targets: ["核心力量 Core Strength", "脊柱伸展 Spinal Extension"], level: 2 },
  { id: "knee_str_off", name: "跪姿伸展-悬空", nameEn: "Knee Stretches Knees Off", reps: "6", cat: "full_body", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["核心 Core", "髋屈肌 Hip Flexors", "股四头肌 Quadriceps"], targets: ["核心控制 Core Control", "平衡 Balance"], level: 3 },
  { id: "long_stretch", name: "长伸展", nameEn: "Long Stretch", reps: "6", cat: "full_body", springs: "1.0–2.0", pos: "平板支撑 Plank", dur: 3, muscles: ["核心 Core", "肩稳定肌 Shoulder Stabilizers", "胸肌 Pectorals", "臀肌 Glutes"], targets: ["全身整合力量 Full Body Integration"], level: 3 },
  { id: "up_stretch", name: "上伸展", nameEn: "Up Stretch", reps: "6", cat: "full_body", springs: "1.0–2.0", pos: "屈髋倒V Pike", dur: 3, muscles: ["核心 Core", "肩稳定肌 Shoulder Stabilizers", "腘绳肌 Hamstrings"], targets: ["核心控制 Core Control"], level: 3 },
  { id: "down_stretch", name: "下伸展", nameEn: "Down Stretch", reps: "6", cat: "full_body", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "核心 Core", "竖脊肌 Erector Spinae"], targets: ["髋屈肌拉伸 Hip Flexor Stretch", "胸椎伸展 Thoracic Extension"], level: 2 },
  { id: "stom_massage_rnd", name: "胃部按摩-圆背", nameEn: "Stomach Massage Round Back", reps: "6", cat: "full_body", springs: "2.0–3.0", pos: "坐位 Seated", dur: 3, muscles: ["核心 Core", "股四头肌 Quadriceps", "小腿 Calves"], targets: ["核心力量 Core Strength", "脊柱屈曲 Spinal Flexion"], level: 2 },
  { id: "stom_massage_flat", name: "胃部按摩-平背", nameEn: "Stomach Massage Straight Back", reps: "6", cat: "full_body", springs: "2.0–3.0", pos: "坐位 Seated", dur: 3, muscles: ["核心 Core", "竖脊肌 Erector Spinae", "股四头肌 Quadriceps"], targets: ["姿势改善 Postural Correction", "胸椎伸展 Thoracic Extension"], level: 2 },
  { id: "stom_massage_reach", name: "胃部按摩-旋转", nameEn: "Stomach Massage Twist", reps: "6", cat: "full_body", springs: "2.0–3.0", pos: "坐位 Seated", dur: 3, muscles: ["核心 Core", "腹斜肌 Obliques", "脊柱旋转肌 Spinal Rotators"], targets: ["脊柱旋转 Spinal Rotation", "核心控制 Core Control"], level: 2 },
  { id: "side_leg_press", name: "侧卧腿推", nameEn: "Side Lying Leg Press", reps: "10", cat: "side_lying", springs: "1.0–2.0", pos: "侧卧 Side Lying", dur: 3, muscles: ["臀肌 Glutes", "外展肌 Abductors", "腹斜肌 Obliques"], targets: ["髋关节稳定 Hip Stability", "侧链激活 Lateral Chain Activation"], level: 2 },
  { id: "side_splits", name: "侧向分腿", nameEn: "Side Splits", reps: "10", cat: "side_lying", springs: "0.5–2.0", pos: "站立 Standing", dur: 3, muscles: ["内收肌 Adductors", "外展肌 Abductors", "核心 Core", "臀肌 Glutes"], targets: ["内收肌力量 Adductor Strength", "平衡 Balance"], level: 3 },
  { id: "pulling_straps", name: "手臂拉绳", nameEn: "Arms Pulling Straps", reps: "6", cat: "back_ext", springs: "0.5–1.0", pos: "俯卧 Prone", dur: 3, muscles: ["竖脊肌 Erector Spinae", "菱形肌 Rhomboids", "中斜方肌 Middle Trapezius", "背阔肌 Latissimus Dorsi"], targets: ["上背力量 Upper Back Strength", "肩胛后缩 Scapular Retraction"], level: 2 },
  { id: "t_pull", name: "T字拉绳", nameEn: "Arms Pulling Straps — T-Pull", reps: "6", cat: "back_ext", springs: "0.5–1.0", pos: "俯卧 Prone", dur: 3, muscles: ["菱形肌 Rhomboids", "中斜方肌 Middle Trapezius", "后三角肌 Posterior Deltoid"], targets: ["上背力量 Upper Back Strength", "肩胛后缩 Scapular Retraction"], level: 2 },
  { id: "swan", name: "天鹅", nameEn: "Swan Dive Prep (Long Box)", reps: "6", cat: "back_ext", springs: "2.0", pos: "俯卧 Prone", dur: 4, muscles: ["竖脊肌 Erector Spinae", "臀肌 Glutes", "腘绳肌 Hamstrings"], targets: ["脊柱伸展 Spinal Extension", "后链激活 Posterior Chain Activation"], level: 2 },
  { id: "back_row_prep", name: "背部划船准备", nameEn: "Back Rowing Preps", reps: "6", cat: "back_ext", springs: "1.0–2.0", pos: "坐位 Seated", dur: 3, muscles: ["菱形肌 Rhomboids", "中斜方肌 Middle Trapezius", "竖脊肌 Erector Spinae"], targets: ["上背力量 Upper Back Strength", "姿势改善 Postural Correction"], level: 2 },
  { id: "hip_flex_str", name: "髋屈肌拉伸", nameEn: "Hip Flexor Stretch", reps: "5", cat: "stretch", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "腰大肌 Psoas Major"], targets: ["髋屈肌柔韧 Hip Flexor Flexibility"], level: 1 },
  { id: "mermaid", name: "美人鱼侧伸展", nameEn: "Mermaid Stretch", reps: "5", cat: "stretch", springs: "1.0", pos: "坐位 Seated", dur: 3, muscles: ["腹斜肌 Obliques", "背阔肌 Latissimus Dorsi", "肋间肌 Intercostals", "腰方肌 Quadratus Lumborum"], targets: ["侧链柔韧 Lateral Chain Flexibility", "肋廓活动度 Rib Cage Mobility"], level: 1 },
  { id: "ham_stretch", name: "屈伸练习", nameEn: "Bend & Stretch", reps: "5", cat: "stretch", springs: "2.0", pos: "仰卧 Supine", dur: 3, muscles: ["腘绳肌 Hamstrings", "小腿 Calves"], targets: ["腘绳肌柔韧 Hamstring Flexibility"], level: 1 },
  { id: "standing_lunge", name: "站立弓步", nameEn: "Standing Lunge", reps: "5", cat: "stretch", springs: "2.0", pos: "站立 Standing", dur: 3, muscles: ["髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "臀肌 Glutes", "核心 Core"], targets: ["髋屈肌拉伸 Hip Flexor Stretch", "平衡 Balance"], level: 2 },
  { id: "eve_lunge", name: "Eve弓步", nameEn: "Eve's Lunge", reps: "5", cat: "stretch", springs: "2.0", pos: "站/跪 Standing/Kneeling", dur: 3, muscles: ["髋屈肌 Hip Flexors", "股四头肌 Quadriceps", "竖脊肌 Erector Spinae"], targets: ["髋屈肌拉伸 Hip Flexor Stretch", "脊柱伸展 Spinal Extension"], level: 2 },
  { id: "chest_expansion", name: "扩胸", nameEn: "Chest Expansion", reps: "5", cat: "stretch", springs: "1.0–2.0", pos: "跪/站 Kneeling/Standing", dur: 3, muscles: ["胸肌 Pectorals", "前三角肌 Anterior Deltoid", "竖脊肌 Erector Spinae"], targets: ["胸椎伸展 Thoracic Extension", "姿势改善 Postural Correction"], level: 1 },
  { id: "thigh_stretch", name: "单腿大腿拉伸", nameEn: "Single Thigh Stretch", reps: "5", cat: "stretch", springs: "2.0", pos: "跪位 Kneeling", dur: 3, muscles: ["股四头肌 Quadriceps", "髋屈肌 Hip Flexors", "核心 Core"], targets: ["股四头肌柔韧 Quadriceps Flexibility"], level: 2 },
  { id: "scooter", name: "滑板车", nameEn: "Scooter", reps: "6", cat: "standing", springs: "1.0–2.0", pos: "站立 Standing", dur: 3, muscles: ["臀肌 Glutes", "腘绳肌 Hamstrings", "核心 Core"], targets: ["臀肌力量 Glute Strength", "平衡 Balance"], level: 2 },
  { id: "front_splits", name: "前后劈腿", nameEn: "Front Splits", reps: "6", cat: "standing", springs: "2.0", pos: "站立 Standing", dur: 4, muscles: ["腘绳肌 Hamstrings", "髋屈肌 Hip Flexors", "核心 Core"], targets: ["腘绳肌柔韧 Hamstring Flexibility", "平衡 Balance"], level: 3 },
];

const CATEGORY_LABELS = {
  warmup: { zh: "热身", en: "Warm-up", color: "#78b478" },
  footwork: { zh: "脚踏板", en: "Footwork", color: "#6890c0" },
  abdominal: { zh: "腹部", en: "Abdominal", color: "#c87878" },
  hip_work: { zh: "髋部", en: "Hip Work", color: "#b078c8" },
  spinal_art: { zh: "脊柱序列", en: "Spinal Art.", color: "#78c8b4" },
  arm_work: { zh: "手臂", en: "Arm Work", color: "#c8a064" },
  full_body: { zh: "全身整合", en: "Full Body", color: "#c89040" },
  side_lying: { zh: "侧卧", en: "Side-Lying", color: "#a078c0" },
  back_ext: { zh: "背伸展", en: "Back Ext.", color: "#60a8b0" },
  stretch: { zh: "拉伸", en: "Stretches", color: "#90b060" },
  standing: { zh: "站立", en: "Standing", color: "#c08060" },
};

// ─── Postural Issue → Exercise Mapping ───
const POSTURAL_CORRECTIONS = {
  sv_head_forward: { issue: "头部前伸", issueEn: "Forward Head", desc: "颈深层屈肌无力，上斜方肌/胸锁乳突肌过紧", descEn: "Deep cervical flexors weak; upper trapezius / SCM tight", strengthen: "颈深层屈肌、下斜方肌、菱形肌", strengthenEn: "Deep cervical flexors, lower trapezius, rhomboids", stretch: "上斜方肌、肩胛提肌、枕下肌、胸肌", stretchEn: "Upper trapezius, levator scapulae, suboccipitals, pectorals", exercises: ["chest_expansion", "pulling_straps", "t_pull", "rowing_front", "back_row_prep", "swan"], priority: 3 },
  sv_cervical_flat: { issue: "颈椎平坦", issueEn: "Flat Cervical Spine", desc: "颈椎曲度减少", descEn: "Reduced cervical lordosis", strengthen: "颈伸肌", strengthenEn: "Cervical extensors", stretch: "颈深层屈肌", stretchEn: "Deep cervical flexors", exercises: ["swan", "chest_expansion", "back_row_prep"], priority: 2 },
  sv_cervical_excessive: { issue: "颈椎过度前凸", issueEn: "Excessive Cervical Lordosis", desc: "颈伸肌过紧，深层屈肌无力", descEn: "Cervical extensors tight; deep flexors weak", strengthen: "颈深层屈肌、核心", strengthenEn: "Deep cervical flexors, core", stretch: "颈伸肌、上斜方肌", stretchEn: "Cervical extensors, upper trapezius", exercises: ["hundred", "chest_expansion", "pulling_straps", "breathing"], priority: 3 },
  sv_ut_flat: { issue: "上胸椎平坦", issueEn: "Flat Upper Thoracic", desc: "上胸椎后凸减少", descEn: "Reduced upper thoracic kyphosis", strengthen: "腹肌", strengthenEn: "Abdominals", stretch: "竖脊肌", stretchEn: "Erector spinae", exercises: ["hundred", "stom_massage_rnd", "knee_str_round", "pelvic_curl"], priority: 2 },
  sv_ut_excessive: { issue: "上胸椎过度后凸", issueEn: "Upper Thoracic Kyphosis", desc: "驼背圆肩，胸肌过紧，上背部无力", descEn: "Rounded shoulders; pectorals tight, upper back weak", strengthen: "菱形肌、中下斜方肌、竖脊肌", strengthenEn: "Rhomboids, mid/lower trapezius, erector spinae", stretch: "胸肌、前三角肌", stretchEn: "Pectorals, anterior deltoid", exercises: ["pulling_straps", "t_pull", "swan", "chest_expansion", "rowing_front", "back_row_prep", "down_stretch", "stom_massage_flat"], priority: 3 },
  sv_lt_flat: { issue: "下胸椎平坦", issueEn: "Flat Lower Thoracic", desc: "下胸椎后凸减少", descEn: "Reduced lower thoracic kyphosis", strengthen: "腹肌、核心", strengthenEn: "Abdominals, core", stretch: "竖脊肌", stretchEn: "Erector spinae", exercises: ["hundred", "coordination", "stom_massage_rnd", "pelvic_curl"], priority: 2 },
  sv_lt_excessive: { issue: "下胸椎过度后凸", issueEn: "Lower Thoracic Kyphosis", desc: "下胸椎曲度增加", descEn: "Increased lower thoracic kyphosis", strengthen: "竖脊肌、核心", strengthenEn: "Erector spinae, core", stretch: "腹肌、髋屈肌", stretchEn: "Abdominals, hip flexors", exercises: ["swan", "pulling_straps", "down_stretch", "chest_expansion", "thigh_stretch"], priority: 3 },
  sv_lumbar_flat: { issue: "腰椎平坦", issueEn: "Flat Lumbar Spine", desc: "腰椎前凸减少，腘绳肌/腹肌可能过紧", descEn: "Reduced lumbar lordosis; hamstrings / abs may be tight", strengthen: "竖脊肌、髋屈肌", strengthenEn: "Erector spinae, hip flexors", stretch: "腘绳肌、臀肌、腹肌", stretchEn: "Hamstrings, glutes, abdominals", exercises: ["swan", "knee_str_arch", "down_stretch", "ham_stretch", "semi_circle"], priority: 3 },
  sv_lumbar_excessive: { issue: "腰椎过度前凸", issueEn: "Excessive Lumbar Lordosis", desc: "腹肌臀肌无力，髋屈肌腰伸肌过紧", descEn: "Abs & glutes weak; hip flexors & lumbar extensors tight", strengthen: "腹横肌、腹直肌、臀肌、腘绳肌", strengthenEn: "TrA, rectus abdominis, glutes, hamstrings", stretch: "髋屈肌、腰部伸肌、股四头肌", stretchEn: "Hip flexors, lumbar extensors, quadriceps", exercises: ["hundred", "pelvic_curl", "hip_flex_str", "leg_lowers", "coordination", "knee_str_round", "elephant", "standing_lunge", "thigh_stretch", "eve_lunge"], priority: 3 },
  sv_pelvis_anterior_tilt: { issue: "骨盆前倾", issueEn: "Anterior Pelvic Tilt", desc: "髋屈肌和腰伸肌过紧，腹肌和臀肌无力", descEn: "Hip flexors & lumbar extensors tight; abs & glutes weak", strengthen: "腹肌、臀肌、腘绳肌", strengthenEn: "Abdominals, glutes, hamstrings", stretch: "髋屈肌、腰伸肌、股四头肌", stretchEn: "Hip flexors, lumbar extensors, quadriceps", exercises: ["pelvic_curl", "hundred", "hip_flex_str", "standing_lunge", "leg_lowers", "scooter", "thigh_stretch", "eve_lunge"], priority: 3 },
  sv_pelvis_posterior_tilt: { issue: "骨盆后倾", issueEn: "Posterior Pelvic Tilt", desc: "腘绳肌和腹肌过紧，髋屈肌和腰伸肌无力", descEn: "Hamstrings & abs tight; hip flexors & lumbar extensors weak", strengthen: "髋屈肌、腰部伸肌", strengthenEn: "Hip flexors, lumbar extensors", stretch: "腘绳肌、臀肌", stretchEn: "Hamstrings, glutes", exercises: ["swan", "knee_str_arch", "ham_stretch", "down_stretch", "semi_circle"], priority: 3 },
  sv_knee_hyperextended: { issue: "膝关节过伸", issueEn: "Knee Hyperextension", desc: "腘绳肌无力，股四头肌过度活跃", descEn: "Hamstrings weak; quadriceps overactive", strengthen: "腘绳肌", strengthenEn: "Hamstrings", stretch: "股四头肌、小腿", stretchEn: "Quadriceps, calves", exercises: ["fw_parallel", "fw_heels", "pelvic_curl", "fw_single", "scooter"], priority: 2 },
  sv_knee_flexed: { issue: "膝关节屈曲", issueEn: "Knee Flexion", desc: "腘绳肌过紧", descEn: "Hamstrings tight", strengthen: "股四头肌", strengthenEn: "Quadriceps", stretch: "腘绳肌", stretchEn: "Hamstrings", exercises: ["fw_parallel", "fw_toes", "ham_stretch", "elephant"], priority: 2 },
  sv_hip_flexed: { issue: "髋关节屈曲", issueEn: "Hip Flexion", desc: "髋屈肌过紧，髋伸肌无力", descEn: "Hip flexors tight; hip extensors weak", strengthen: "臀肌、腘绳肌", strengthenEn: "Glutes, hamstrings", stretch: "髋屈肌、腰大肌", stretchEn: "Hip flexors, psoas major", exercises: ["hip_flex_str", "standing_lunge", "scooter", "pelvic_curl", "eve_lunge", "thigh_stretch"], priority: 3 },
  fv_feet_inverted: { issue: "足内翻/旋后", issueEn: "Feet Supinated", desc: "腓骨肌无力", descEn: "Peroneals weak", strengthen: "腓骨肌", strengthenEn: "Peroneals", stretch: "胫骨后肌", stretchEn: "Tibialis posterior", exercises: ["fw_parallel", "prances", "fw_toes"], priority: 1 },
  fv_feet_everted: { issue: "足外翻/旋前", issueEn: "Feet Pronated", desc: "足弓塌陷，胫骨后肌无力", descEn: "Arch collapse; tibialis posterior weak", strengthen: "胫骨后肌、足内在肌", strengthenEn: "Tibialis posterior, foot intrinsics", stretch: "腓骨肌", stretchEn: "Peroneals", exercises: ["fw_toes", "prances", "fw_heels", "fw_single"], priority: 2 },
  fv_knees_knock: { issue: "膝外翻 X型腿", issueEn: "Genu Valgum (Knock-Knees)", desc: "臀中肌无力，内收肌过紧", descEn: "Gluteus medius weak; adductors tight", strengthen: "臀中肌、髋外展肌", strengthenEn: "Gluteus medius, hip abductors", stretch: "内收肌、髂胫束", stretchEn: "Adductors, ITB", exercises: ["side_leg_press", "fw_parallel", "openings", "scooter", "fw_single"], priority: 2 },
  fv_knees_bow: { issue: "膝内翻 O型腿", issueEn: "Genu Varum (Bow Legs)", desc: "外展肌过紧，内收肌无力", descEn: "Abductors tight; adductors weak", strengthen: "内收肌", strengthenEn: "Adductors", stretch: "外展肌", stretchEn: "Abductors", exercises: ["frog", "fw_v_pos", "fw_wide", "side_splits"], priority: 2 },
  fv_pelvis_elevated: { issue: "骨盆不等高", issueEn: "Pelvic Lateral Tilt", desc: "侧链肌肉不平衡", descEn: "Lateral chain imbalance", strengthen: "腹斜肌、腰方肌", strengthenEn: "Obliques, quadratus lumborum", stretch: "腰方肌、背阔肌", stretchEn: "Quadratus lumborum, latissimus dorsi", exercises: ["mermaid", "side_leg_press", "side_splits", "obliques_supine"], priority: 3 },
  fv_pelvis_rotated_cw: { issue: "骨盆顺时针旋转", issueEn: "Pelvis Rotated CW", desc: "骨盆旋转不对称", descEn: "Pelvic rotational asymmetry", strengthen: "腹斜肌", strengthenEn: "Obliques", stretch: "对侧紧张肌群", stretchEn: "Contralateral tight muscles", exercises: ["obliques_supine", "stom_massage_reach", "mermaid", "leg_circles"], priority: 2 },
  fv_pelvis_rotated_ccw: { issue: "骨盆逆时针旋转", issueEn: "Pelvis Rotated CCW", desc: "骨盆旋转不对称", descEn: "Pelvic rotational asymmetry", strengthen: "腹斜肌", strengthenEn: "Obliques", stretch: "对侧紧张肌群", stretchEn: "Contralateral tight muscles", exercises: ["obliques_supine", "stom_massage_reach", "mermaid", "leg_circles"], priority: 2 },
  fv_rib_elevated: { issue: "肋廓抬高", issueEn: "Rib Cage Elevated", desc: "肋廓位置偏高", descEn: "Rib cage elevated position", strengthen: "腹斜肌、腹横肌", strengthenEn: "Obliques, TrA", stretch: "背阔肌", stretchEn: "Latissimus dorsi", exercises: ["hundred", "breathing", "obliques_supine", "mermaid"], priority: 2 },
  fv_rib_shifted: { issue: "肋廓偏移", issueEn: "Rib Cage Shifted", desc: "肋廓位置偏移", descEn: "Rib cage lateral shift", strengthen: "核心侧链", strengthenEn: "Lateral core chain", stretch: "对侧紧张肌群", stretchEn: "Contralateral tight muscles", exercises: ["mermaid", "obliques_supine", "side_leg_press"], priority: 2 },
  fv_shoulder_elevated: { issue: "肩部抬高", issueEn: "Shoulder Elevation", desc: "上斜方肌过紧", descEn: "Upper trapezius tight", strengthen: "下斜方肌、背阔肌", strengthenEn: "Lower trapezius, latissimus dorsi", stretch: "上斜方肌、肩胛提肌", stretchEn: "Upper trapezius, levator scapulae", exercises: ["arm_circles", "pulling_straps", "mermaid", "rowing_front"], priority: 2 },
  fv_shoulder_depressed: { issue: "肩部下沉", issueEn: "Shoulder Depression", desc: "下斜方肌过度活跃", descEn: "Lower trapezius overactive", strengthen: "上斜方肌", strengthenEn: "Upper trapezius", stretch: "下斜方肌", stretchEn: "Lower trapezius", exercises: ["arm_circles", "salute", "bicep_curls"], priority: 2 },
  fv_head_tilted: { issue: "头部倾斜", issueEn: "Head Tilted", desc: "颈侧肌群不平衡", descEn: "Lateral cervical muscle imbalance", strengthen: "弱侧颈肌", strengthenEn: "Weak-side cervical muscles", stretch: "紧侧颈肌", stretchEn: "Tight-side cervical muscles", exercises: ["chest_expansion", "mermaid", "breathing"], priority: 2 },
  bv_feet_everted: { issue: "足外翻(背面)", issueEn: "Feet Pronated (Posterior)", desc: "跟腱外翻", descEn: "Calcaneal valgus", strengthen: "胫骨后肌", strengthenEn: "Tibialis posterior", stretch: "腓骨肌", stretchEn: "Peroneals", exercises: ["fw_toes", "prances", "fw_heels", "fw_single"], priority: 2 },
  bv_femur_medial: { issue: "股骨内旋", issueEn: "Femoral Medial Rotation", desc: "髋内旋肌过紧，外旋肌无力", descEn: "Hip internal rotators tight; external rotators weak", strengthen: "髋外旋肌、臀肌", strengthenEn: "Hip external rotators, glutes", stretch: "髋内旋肌", stretchEn: "Hip internal rotators", exercises: ["frog", "fw_v_pos", "openings", "side_leg_press", "scooter"], priority: 2 },
  bv_femur_lateral: { issue: "股骨外旋", issueEn: "Femoral Lateral Rotation", desc: "髋外旋肌过紧", descEn: "Hip external rotators tight", strengthen: "髋内旋肌", strengthenEn: "Hip internal rotators", stretch: "髋外旋肌", stretchEn: "Hip external rotators", exercises: ["fw_parallel", "leg_circles", "fw_wide"], priority: 2 },
  bv_pelvis_elevated: { issue: "骨盆不等高(背面)", issueEn: "Pelvic Lateral Tilt (Posterior)", desc: "侧链失衡", descEn: "Lateral chain imbalance", strengthen: "腹斜肌、腰方肌", strengthenEn: "Obliques, quadratus lumborum", stretch: "腰方肌", stretchEn: "Quadratus lumborum", exercises: ["mermaid", "side_leg_press", "obliques_supine"], priority: 3 },
  bv_scap_protracted: { issue: "肩胛骨前引", issueEn: "Scapulae Protracted", desc: "菱形肌/中斜方肌无力，胸肌过紧", descEn: "Rhomboids / mid trapezius weak; pectorals tight", strengthen: "菱形肌、中斜方肌", strengthenEn: "Rhomboids, middle trapezius", stretch: "胸肌、前锯肌", stretchEn: "Pectorals, serratus anterior", exercises: ["pulling_straps", "t_pull", "rowing_front", "chest_expansion", "back_row_prep"], priority: 3 },
  bv_scap_retracted: { issue: "肩胛骨后缩", issueEn: "Scapulae Retracted", desc: "菱形肌过紧，前锯肌无力", descEn: "Rhomboids tight; serratus anterior weak", strengthen: "前锯肌", strengthenEn: "Serratus anterior", stretch: "菱形肌", stretchEn: "Rhomboids", exercises: ["arm_press", "hug_a_tree", "long_stretch"], priority: 2 },
  bv_scap_elevated: { issue: "肩胛骨上提", issueEn: "Scapulae Elevated", desc: "上斜方肌过紧", descEn: "Upper trapezius tight", strengthen: "下斜方肌、前锯肌", strengthenEn: "Lower trapezius, serratus anterior", stretch: "上斜方肌", stretchEn: "Upper trapezius", exercises: ["arm_circles", "arm_press", "pulling_straps", "mermaid"], priority: 2 },
  bv_scap_depressed: { issue: "肩胛骨下沉", issueEn: "Scapulae Depressed", desc: "下斜方肌过度活跃", descEn: "Lower trapezius overactive", strengthen: "上斜方肌", strengthenEn: "Upper trapezius", stretch: "下斜方肌", stretchEn: "Lower trapezius", exercises: ["salute", "bicep_curls", "arm_circles"], priority: 2 },
  bv_scap_winging: { issue: "翼状肩胛", issueEn: "Scapulae Winging", desc: "前锯肌无力", descEn: "Serratus anterior weak", strengthen: "前锯肌、下斜方肌", strengthenEn: "Serratus anterior, lower trapezius", stretch: "胸小肌", stretchEn: "Pectoralis minor", exercises: ["arm_press", "long_stretch", "up_stretch", "hug_a_tree"], priority: 3 },
  bv_scap_ant_tipped: { issue: "肩胛骨前倾", issueEn: "Scapulae Anteriorly Tipped", desc: "胸小肌过紧，下斜方肌无力", descEn: "Pectoralis minor tight; lower trapezius weak", strengthen: "下斜方肌、前锯肌", strengthenEn: "Lower trapezius, serratus anterior", stretch: "胸小肌", stretchEn: "Pectoralis minor", exercises: ["chest_expansion", "pulling_straps", "t_pull", "arm_circles"], priority: 3 },
  bv_humeri_medial: { issue: "肱骨内旋", issueEn: "Humeri Medially Rotated", desc: "肩内旋肌过紧，外旋肌无力", descEn: "Shoulder internal rotators tight; external rotators weak", strengthen: "冈下肌、小圆肌", strengthenEn: "Infraspinatus, teres minor", stretch: "胸肌、前三角肌", stretchEn: "Pectorals, anterior deltoid", exercises: ["chest_expansion", "arm_circles", "pulling_straps", "t_pull", "rowing_front"], priority: 2 },
  bv_spine_flat_areas: { issue: "脊柱平坦区域", issueEn: "Spinal Flat Areas", desc: "脊柱某段曲度减少，分节运动受限", descEn: "Reduced segmental spinal curvature; limited articulation", strengthen: "局部脊柱肌群", strengthenEn: "Local spinal muscles", stretch: "对应紧张肌群", stretchEn: "Corresponding tight muscles", exercises: ["pelvic_curl", "short_spine", "elephant", "swan", "knee_str_round"], priority: 3 },
  bv_spine_imbalances: { issue: "脊柱不对称", issueEn: "Spinal Imbalances", desc: "左右侧肌力不平衡", descEn: "Bilateral muscle strength imbalance", strengthen: "腹斜肌、腰方肌、多裂肌", strengthenEn: "Obliques, quadratus lumborum, multifidus", stretch: "紧侧肌群", stretchEn: "Tight-side muscles", exercises: ["mermaid", "side_leg_press", "obliques_supine", "side_splits", "stom_massage_reach"], priority: 3 },
};

// ─── Program Generator ───
function generateProgram(issues, sideData, level) {
  const exercisePriority = {};
  const exerciseReasons = {};
  const issueDetails = [];
  let maxPrio = 0;

  issues.forEach(({ id, sides: s }) => {
    const corr = POSTURAL_CORRECTIONS[id];
    if (!corr) return;
    const sideLabel = s.length ? ` (${s.join(",")})` : "";
    issueDetails.push({ ...corr, sideLabel });
    if (corr.priority > maxPrio) maxPrio = corr.priority;
    corr.exercises.forEach((exId) => {
      exercisePriority[exId] = (exercisePriority[exId] || 0) + corr.priority;
      if (!exerciseReasons[exId]) exerciseReasons[exId] = [];
      exerciseReasons[exId].push({ zh: corr.issue + sideLabel, en: corr.issueEn + sideLabel });
    });
  });

  const baseSessions = maxPrio >= 3 ? 12 : maxPrio >= 2 ? 8 : 6;
  const totalSessions = Math.min(18, baseSessions + Math.min(4, Math.floor(issues.length / 3)));

  const sortedIds = Object.keys(exercisePriority).sort((a, b) => exercisePriority[b] - exercisePriority[a]);
  const available = sortedIds.map((id) => REFORMER_EXERCISES.find((e) => e.id === id)).filter((e) => e && e.level <= level);

  const focusPool = [
    { focus: "核心与脊柱 Core & Spine", cats: ["warmup", "footwork", "abdominal", "spinal_art", "back_ext", "stretch"] },
    { focus: "上肢与肩胛 Upper Body & Scapular", cats: ["warmup", "footwork", "arm_work", "back_ext", "full_body", "stretch"] },
    { focus: "下肢与髋部 Lower Body & Hip", cats: ["warmup", "footwork", "hip_work", "standing", "side_lying", "stretch"] },
    { focus: "全身整合 Full Body Integration", cats: ["warmup", "footwork", "full_body", "abdominal", "hip_work", "arm_work", "stretch"] },
    { focus: "侧链与旋转 Lateral Chain & Rotation", cats: ["warmup", "footwork", "side_lying", "abdominal", "full_body", "back_ext", "stretch"] },
  ];

  const getPhase = (i, total) => {
    const pct = i / total;
    if (pct < 0.3) return { phase: "激活期", phaseEn: "Activation", phaseIdx: 0, levelCap: Math.max(1, level - 1), catMax: 2, fwMax: 3 };
    if (pct < 0.7) return { phase: "强化期", phaseEn: "Strengthening", phaseIdx: 1, levelCap: level, catMax: 3, fwMax: 3 };
    return { phase: "整合期", phaseEn: "Integration", phaseIdx: 2, levelCap: level + 1, catMax: 3, fwMax: 4 };
  };

  // Sets by phase × category
  const getSets = (cat, phaseIdx) => {
    if (cat === "warmup") return 1;
    if (cat === "stretch") return 1;
    if (cat === "footwork") return phaseIdx === 0 ? 1 : 2;
    // core categories
    return phaseIdx === 0 ? 2 : 3;
  };

  const seededShuffle = (arr, seed) => {
    const a = [...arr]; let s = seed;
    for (let i = a.length - 1; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // Full exercise pool (all exercises at appropriate level) for filling sessions
  const allPool = REFORMER_EXERCISES.filter(e => e.level <= level);

  const sessions = [];
  const recentlyUsed = {};
  const TARGET_TIME = 45;
  const MIN_TIME = 15;

  const focusMap = {
    warmup: { zh: "热身", en: "Warm-up" },
    footwork: { zh: "脚踏", en: "Footwork" },
    abdominal: { zh: "核心", en: "Core" },
    spinal_art: { zh: "脊柱", en: "Spine" },
    back_ext: { zh: "背伸展", en: "Back Extension" },
    arm_work: { zh: "上肢", en: "Upper Body" },
    hip_work: { zh: "髋部", en: "Hip" },
    full_body: { zh: "全身整合", en: "Full Body" },
    side_lying: { zh: "侧链", en: "Lateral Chain" },
    standing: { zh: "站姿", en: "Standing" },
    stretch: { zh: "拉伸", en: "Stretch" },
  };

  for (let i = 0; i < totalSessions; i++) {
    const focusTemplate = focusPool[i % focusPool.length];
    const { phase, phaseEn, phaseIdx, levelCap, catMax, fwMax } = getPhase(i, totalSessions);
    const session = { num: i + 1, phase, phaseEn, phaseIdx, focus: "", focusEn: "", exercises: [], totalTime: 0 };
    let timeLeft = TARGET_TIME;
    const added = new Set();

    // Add exercises from a category, preferring priority exercises then falling back to all
    const addFromCat = (cat, max, priorityOnly) => {
      const pool = priorityOnly ? available : allPool;
      let catExs = pool.filter((e) => e.cat === cat && !added.has(e.id) && e.level <= levelCap);
      catExs = seededShuffle(catExs, i * 137 + cat.charCodeAt(0) * 31);
      catExs.sort((a, b) => {
        const pA = exercisePriority[a.id] || 0, pB = exercisePriority[b.id] || 0;
        const rA = (recentlyUsed[a.id] !== undefined && i - recentlyUsed[a.id] <= 2) ? -3 : 0;
        const rB = (recentlyUsed[b.id] !== undefined && i - recentlyUsed[b.id] <= 2) ? -3 : 0;
        return (pB + rB) - (pA + rA);
      });
      let c = 0;
      catExs.forEach((e) => {
        if (c >= max || timeLeft < e.dur) return;
        const sets = getSets(cat, phaseIdx);
        session.exercises.push({ ...e, sets, reasons: exerciseReasons[e.id] || [] });
        timeLeft -= e.dur;
        added.add(e.id);
        recentlyUsed[e.id] = i;
        c++;
      });
    };

    // Phase 1: Add priority exercises from template categories
    addFromCat("warmup", 2, true);
    addFromCat("footwork", fwMax, true);
    focusTemplate.cats.forEach((cat) => {
      if (cat === "warmup" || cat === "footwork") return;
      addFromCat(cat, cat === "stretch" ? 3 : catMax, true);
    });

    // Phase 2: Fill remaining time from ALL exercises (not just priority)
    if (timeLeft > 2) {
      // First try template categories with full pool
      focusTemplate.cats.forEach((cat) => {
        if (timeLeft <= 2) return;
        addFromCat(cat, 2, false);
      });
    }

    // Phase 3: If still under target, try any category from full pool
    if (timeLeft > 2) {
      const allCats = ["footwork", "abdominal", "hip_work", "spinal_art", "arm_work", "full_body", "back_ext", "side_lying", "standing", "stretch"];
      for (const cat of allCats) {
        if (timeLeft <= 2) break;
        addFromCat(cat, 2, false);
      }
    }

    // Phase 4: If STILL under minimum time, boost sets on existing exercises
    let actualTime = TARGET_TIME - timeLeft;
    if (actualTime < MIN_TIME) {
      session.exercises.forEach(e => {
        if (e.cat !== "warmup" && e.cat !== "stretch") {
          e.sets = Math.min(e.sets + 1, 4);
        }
      });
    }

    // Calculate real session time: sum of (dur * sets) or just use exercise count heuristic
    // Each exercise ~3-5 min base, sets multiply effective time
    const realTime = session.exercises.reduce((sum, e) => sum + e.dur * Math.max(1, e.sets * 0.7), 0);
    session.totalTime = Math.round(Math.max(realTime, actualTime));

    // Derive focus label from actual exercises in session (include footwork)
    const catCount = {};
    session.exercises.forEach(e => {
      if (e.cat !== "warmup" && e.cat !== "stretch") {
        catCount[e.cat] = (catCount[e.cat] || 0) + 1;
      }
    });
    const topCats = Object.entries(catCount).sort((a,b) => b[1] - a[1]);
    if (topCats.length >= 2) {
      const c1 = focusMap[topCats[0][0]] || { zh: topCats[0][0], en: topCats[0][0] };
      const c2 = focusMap[topCats[1][0]] || { zh: topCats[1][0], en: topCats[1][0] };
      session.focus = `${c1.zh} & ${c2.zh}`;
      session.focusEn = `${c1.en} & ${c2.en}`;
    } else if (topCats.length === 1) {
      const c1 = focusMap[topCats[0][0]] || { zh: topCats[0][0], en: topCats[0][0] };
      session.focus = c1.zh;
      session.focusEn = c1.en;
    } else {
      session.focus = "基础";
      session.focusEn = "Fundamentals";
    }
    sessions.push(session);
  }

  return { sessions, issueDetails, totalSessions };
}


// ═══════════════════════════════════
// SOFT 3D PASTEL UI
// ═══════════════════════════════════

const P = {
  bg: "linear-gradient(165deg, #F5EDE6 0%, #F0E6E0 25%, #EAE4EE 50%, #E4EAF0 75%, #F2ECE6 100%)",
  card: "rgba(255,255,255,0.75)",
  cardSolid: "#fff",
  glass: "rgba(255,255,255,0.55)",
  text: "#4A3F3A",
  textMid: "#8A7E78",
  textSoft: "#B5AAA4",
  textFaint: "#D0C8C2",
  peach: "#E8A090",
  peachSoft: "rgba(232,160,144,0.15)",
  peachGlow: "rgba(232,160,144,0.25)",
  sky: "#A0C4D8",
  skySoft: "rgba(160,196,216,0.15)",
  blush: "#D8A0B0",
  blushSoft: "rgba(216,160,176,0.12)",
  cream: "#E8D8C0",
  creamSoft: "rgba(232,216,192,0.2)",
  sage: "#A8C0A0",
  sageSoft: "rgba(168,192,160,0.15)",
  lav: "#B8A8D0",
  lavSoft: "rgba(184,168,208,0.15)",
  terra: "#C8A088",
  terraSoft: "rgba(200,160,136,0.15)",
  shadow: "0 8px 32px rgba(180,160,140,0.12), 0 2px 8px rgba(180,160,140,0.08)",
  shadowSm: "0 4px 16px rgba(180,160,140,0.1), 0 1px 4px rgba(180,160,140,0.06)",
  shadowLg: "0 16px 48px rgba(180,160,140,0.15), 0 4px 12px rgba(180,160,140,0.08)",
  shadowInset: "inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(180,160,140,0.1)",
};

const CC = {
  warmup: { bg: P.sageSoft, c: P.sage, glow: "rgba(168,192,160,0.3)" },
  footwork: { bg: P.skySoft, c: P.sky, glow: "rgba(160,196,216,0.3)" },
  abdominal: { bg: P.peachSoft, c: P.peach, glow: "rgba(232,160,144,0.3)" },
  hip_work: { bg: P.lavSoft, c: P.lav, glow: "rgba(184,168,208,0.3)" },
  spinal_art: { bg: "rgba(144,192,176,0.12)", c: "#90C0B0", glow: "rgba(144,192,176,0.3)" },
  arm_work: { bg: P.creamSoft, c: "#C8B090", glow: "rgba(200,176,144,0.3)" },
  full_body: { bg: P.terraSoft, c: P.terra, glow: "rgba(200,160,136,0.3)" },
  side_lying: { bg: P.blushSoft, c: P.blush, glow: "rgba(216,160,176,0.3)" },
  back_ext: { bg: P.skySoft, c: "#88A8C0", glow: "rgba(136,168,192,0.3)" },
  stretch: { bg: P.sageSoft, c: "#90B080", glow: "rgba(144,176,128,0.3)" },
  standing: { bg: P.terraSoft, c: "#B89078", glow: "rgba(184,144,120,0.3)" },
};

export default function App() {
  const [step, setStep] = useState(1);
  const [checks, setChecks] = useState({});
  const [sides, setSides] = useState({});
  const [notes, setNotes] = useState({});
  const [clientLevel, setClientLevel] = useState(2);
  const [clientName, setClientName] = useState("");
  const [program, setProgram] = useState(null);
  const [activeView, setActiveView] = useState("sideView");
  const [activeWeek, setActiveWeek] = useState("all");
  const [expSession, setExpSession] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [expEx, setExpEx] = useState(null);
  const [showEmail, setShowEmail] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailClientName, setEmailClientName] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lang, setLang] = useState("zh");
  const t = (zh, en) => lang === "en" ? en : zh;
  const tb = (zh, en) => lang === "en" ? en : `${zh} ${en}`;
  // Split bilingual strings like "膈肌 Diaphragm" → zh:"膈肌" en:"Diaphragm"
  const tl = (s) => { if (!s) return s; const m = s.match(/^([\u4e00-\u9fff\u3400-\u4dbf·–]+)\s*(.*)$/); return m ? (lang === "en" ? m[2] : s) : s; };

  const toggle = useCallback((id) => setChecks((p) => ({ ...p, [id]: !p[id] })), []);

  // Generate email body as plain text
  const buildEmailBody = useCallback(() => {
    if (!program) return "";
    const name = emailClientName || clientName;
    const lines = [];
    lines.push(`OiaOia Pilates — Postural Analysis & Program Report`);
    lines.push(`体态分析与课程设计报告`);
    lines.push(`Based on contemporary Reformer methodology and principles`);
    if (name) lines.push(`\nClient 客户: ${name}`);
    lines.push(`Total Sessions 总课程数: ${program.totalSessions} (~45 min each)`);
    lines.push(`\n${"═".repeat(40)}`);
    lines.push(`POSTURAL ANALYSIS SUMMARY 体态分析摘要`);
    lines.push(`${"═".repeat(40)}\n`);
    program.issueDetails.forEach((d, i) => {
      const prio = d.priority >= 3 ? "●●●" : d.priority >= 2 ? "●●" : "●";
      lines.push(`${i + 1}. ${d.issue} ${d.issueEn} ${d.sideLabel || ""} ${prio}`);
      lines.push(`   ${d.desc}`);
      lines.push(`   ${d.descEn}`);
      lines.push(`   ↑ 加强 Strengthen: ${d.strengthen} / ${d.strengthenEn}`);
      lines.push(`   ↓ 拉伸 Stretch: ${d.stretch} / ${d.stretchEn}`);
      lines.push("");
    });
    lines.push(`${"═".repeat(40)}`);
    lines.push(`PROGRAM DESIGN 课程设计`);
    lines.push(`${"═".repeat(40)}\n`);
    program.sessions.forEach((s) => {
      lines.push(`Session ${s.num} · ${s.phase} · ${s.focus} · ${s.totalTime}min`);
      s.exercises.forEach((ex, j) => {
        lines.push(`  ${j + 1}. ${ex.name} ${ex.nameEn} | ${ex.sets}×${ex.reps} | ${ex.springs} 弹簧 Springs`);
        if (ex.reasons.length) lines.push(`     → ${ex.reasons.map(r => r.zh).join(", ")}`);
      });
      lines.push("");
    });
    lines.push(`\n— OiaOia Pilates`);
    return lines.join("\n");
  }, [program, clientName, emailClientName]);


  // ═══ PDF GENERATION ═══
  const buildPDFHTML = useCallback(() => {
    if (!program) return "";
    const name = emailClientName || clientName || "";
    const isEN = lang === "en";
    const issues = program.issueDetails.map((d, i) => {
      const prio = d.priority >= 3 ? "●●●" : d.priority >= 2 ? "●●" : "●";
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600">${i+1}. ${isEN ? d.issueEn : d.issue}${d.sideLabel || ""} <span style="color:#E8A090">${prio}</span></td>
      </tr>
      <tr><td style="padding:4px 12px 4px 24px;color:#666;font-size:13px">${isEN ? d.descEn : d.desc}${!isEN ? ` <span style='color:#999;font-size:11px'>${d.descEn}</span>` : ""}</td></tr>
      <tr><td style="padding:4px 12px 4px 24px;font-size:12px"><span style="color:#C8A088">↑ ${isEN ? "Strengthen" : "加强"}: </span>${isEN ? d.strengthenEn : d.strengthen}${!isEN ? ` <span style='color:#999;font-size:11px'>${d.strengthenEn}</span>` : ""}</td></tr>
      <tr><td style="padding:4px 12px 8px 24px;font-size:12px"><span style="color:#A0C4D8">↓ ${isEN ? "Stretch" : "拉伸"}: </span>${isEN ? d.stretchEn : d.stretch}${!isEN ? ` <span style='color:#999;font-size:11px'>${d.stretchEn}</span>` : ""}</td></tr>`;
    }).join("");

    const sessions = program.sessions.map(s => {
      const exRows = s.exercises.map((ex, j) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;width:24px;color:#999;text-align:center;font-size:12px">${j+1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;font-size:13px"><b>${isEN ? ex.nameEn : ex.name}</b>${!isEN ? ` <span style='color:#999;font-size:11px'>${ex.nameEn}</span>` : ""}${ex.reasons.length ? `<br><span style='color:#999;font-size:11px'>${isEN ? "For" : "针对"}: ${ex.reasons.map(r => isEN ? r.en : r.zh).join(", ")}</span>` : ""}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;white-space:nowrap">${ex.sets}×${ex.reps}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;color:#666;white-space:nowrap">${ex.springs}</td>
      </tr>`).join("");
      return `<div style="margin-bottom:20px;page-break-inside:avoid">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="width:36px;height:36px;border-radius:12px;background:${s.phaseIdx===0?"#E8A090":s.phaseIdx===1?"#A0C4D8":"#B8A8D0"};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">${s.num}</div>
          <div><div style="font-weight:600;font-size:14px">${isEN ? (s.focusEn || s.focus) : s.focus}</div><div style="font-size:11px;color:#999">${isEN ? (s.phaseEn || s.phase) : s.phase} · ${s.exercises.length} ${isEN ? "exercises" : "个动作"} · ${s.totalTime}min</div></div>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#fafafa">
            <th style="padding:6px 8px;font-size:11px;color:#999;text-align:center;width:24px">#</th>
            <th style="padding:6px 8px;font-size:11px;color:#999;text-align:left">${isEN ? "Exercise" : "动作"}</th>
            <th style="padding:6px 8px;font-size:11px;color:#999;text-align:center">${isEN ? "Sets×Reps" : "组×次"}</th>
            <th style="padding:6px 8px;font-size:11px;color:#999;text-align:center">${isEN ? "Springs" : "弹簧"}</th>
          </tr></thead>
          <tbody>${exRows}</tbody>
        </table>
      </div>`;
    }).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OiaOia Pilates${name ? " — " + name : ""}</title>
      <style>@page{margin:20mm 15mm}body{font-family:-apple-system,system-ui,'Noto Sans SC',sans-serif;color:#333;line-height:1.5;max-width:800px;margin:0 auto;padding:20px}
      @media print{button{display:none!important}}</style></head><body>
      <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #E8A090">
        <div style="font-size:24px;font-weight:700;color:#E8A090;margin-bottom:4px">OiaOia Pilates</div>
        <div style="font-size:18px;font-weight:600;margin-bottom:4px">${isEN ? "Postural Analysis & Program Report" : "体态分析与课程设计报告"}</div>
        <div style="font-size:12px;color:#999">Based on contemporary Reformer methodology and principles</div>
        ${name ? `<div style="font-size:14px;margin-top:10px;color:#666">${isEN ? "Client" : "客户"}: <b>${name}</b></div>` : ""}
        <div style="font-size:13px;color:#666;margin-top:4px">${isEN ? `${program.totalSessions} Sessions · ~45min each` : `共 ${program.totalSessions} 次课程 · 每次约45分钟`}</div>
      </div>
      <div style="margin-bottom:30px">
        <h2 style="font-size:18px;color:#333;border-bottom:1px solid #ddd;padding-bottom:8px">${isEN ? "Postural Analysis Summary" : "体态分析摘要"}</h2>
        <table style="width:100%">${issues}</table>
      </div>
      <div>
        <h2 style="font-size:18px;color:#333;border-bottom:1px solid #ddd;padding-bottom:8px">${isEN ? "Program Design" : "课程设计"}</h2>
        <div style="font-size:12px;color:#999;margin-bottom:16px">${isEN ? "Recommended 2–3× per week" : "建议每周2–3次"}</div>
        ${sessions}
      </div>
      <div style="text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;color:#999;font-size:12px">— OiaOia Pilates —</div>
      <button onclick="window.print()" style="position:fixed;bottom:20px;right:20px;padding:12px 24px;border-radius:100px;border:none;cursor:pointer;font-size:14px;font-weight:600;background:#E8A090;color:#fff;box-shadow:0 4px 20px rgba(232,160,144,0.4)">${isEN ? "⬇ Save as PDF" : "⬇ 保存为PDF"}</button>
      </body></html>`;
  }, [program, clientName, emailClientName, lang]);

  const handleDownloadPDF = useCallback(() => {
    const html = buildPDFHTML();
    if (!html) return;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }, [buildPDFHTML]);

  const handleSendEmail = useCallback(() => {
    if (!emailTo || !emailTo.includes("@")) return;
    setEmailSending(true);
    const name = emailClientName || clientName || "";
    // Open PDF in new tab for user to save/print
    const html = buildPDFHTML();
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    // Also open mailto with brief text
    const subject = encodeURIComponent(`OiaOia Pilates — Program${name ? ` for ${name}` : ""}`);
    const brief = encodeURIComponent(`Hi,\n\nPlease find attached the OiaOia Pilates postural analysis and program report${name ? ` for ${name}` : ""}.\n\n— OiaOia Pilates`);
    setTimeout(() => window.open(`mailto:${emailTo}?subject=${subject}&body=${brief}`, "_self"), 500);
    // Also sync emailClientName back to header if it was newly entered
    if (emailClientName && !clientName) setClientName(emailClientName);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
      setTimeout(() => { setEmailSent(false); setShowEmail(false); }, 1800);
    }, 800);
  }, [emailTo, clientName, emailClientName, buildPDFHTML]);
  const toggleSide = useCallback((id, s) => setSides((p) => ({ ...p, [`${id}_${s}`]: !p[`${id}_${s}`] })), []);
  const getIssues = useCallback(() => Object.entries(checks).filter(([id, v]) => v && POSTURAL_CORRECTIONS[id]).map(([id]) => ({ id, sides: [...(sides[`${id}_R`] ? ["R"] : []), ...(sides[`${id}_L`] ? ["L"] : [])] })), [checks, sides]);
  const issueCount = useMemo(() => Object.entries(checks).filter(([id, v]) => v && POSTURAL_CORRECTIONS[id]).length, [checks]);
  const handleGen = useCallback(() => { const i = getIssues(); if (!i.length) { alert(t("请至少选择一个体态问题", "Please select at least one postural issue")); return; } setProgram(generateProgram(i, sides, clientLevel)); setStep(3); }, [getIssues, sides, clientLevel]);

  const tag = (bg, c, text) => <span style={{ display: "inline-block", fontSize: 10, padding: "4px 12px", borderRadius: 100, background: bg, color: c, fontWeight: 500, lineHeight: 1.3 }}>{text}</span>;

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: "'Quicksand', 'Noto Sans SC', system-ui, sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700&family=Quicksand:wght@300;400;500;600;700&family=Quicksand:wght@300&display=swap" rel="stylesheet" />
      <style>{`
        ::selection{background:rgba(232,160,144,0.2)}
        input::placeholder{color:${P.textFaint}}
        *{box-sizing:border-box}
        @keyframes floatA{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.02)}}
        @keyframes floatB{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(3deg)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>

      {/* Decorative floating blobs */}
      <div style={{ position: "fixed", top: 60, right: "8%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,160,144,0.15) 0%, transparent 70%)", animation: "floatA 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", left: "5%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(160,196,216,0.12) 0%, transparent 70%)", animation: "floatB 10s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "10%", width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,168,208,0.1) 0%, transparent 70%)", animation: "floatA 12s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 0 }} />

      {/* ═══ HEADER ═══ */}
      <header style={{ position: "relative", zIndex: 10, padding: "24px 0 0" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 16,
                background: `linear-gradient(140deg, ${P.peach}, ${P.blush}, ${P.sky})`,
                boxShadow: `0 6px 20px ${P.peachGlow}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 20, color: "#fff", fontFamily: "'Quicksand'", textShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>p</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Quicksand'", fontSize: 22, color: P.text, lineHeight: 1.1 }}>Pilates Reformer</div>
                {lang === "zh"
                  ? <div style={{ fontSize: 11, color: P.textSoft, marginTop: 2, letterSpacing: 0.3 }}>OiaOia Pilates · 体态评估与课程设计</div>
                  : <div style={{ fontSize: 11, color: P.textSoft, marginTop: 2, letterSpacing: 0.3 }}>OiaOia Pilates · Postural Assessment & Program Design</div>
                }
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} style={{
                padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                background: P.card, backdropFilter: "blur(20px)", boxShadow: P.shadowSm,
                color: P.textMid, transition: "all 0.3s",
              }}>{lang === "zh" ? "EN" : "中文"}</button>
              <div style={{
                background: P.card, backdropFilter: "blur(20px)", borderRadius: 100,
                padding: "8px 20px", boxShadow: P.shadowSm,
              }}>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t("客户姓名", "Client Name")} style={{ background: "transparent", border: "none", color: P.text, fontSize: 13, width: 160, outline: "none", textAlign: "center" }} />
              </div>
            </div>
          </div>

          {/* Step Pills - 3D capsule style */}
          <div style={{
            background: P.card, backdropFilter: "blur(20px)",
            borderRadius: 22, padding: 5,
            boxShadow: P.shadow,
          }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ n: 1, zh: "体态分析", en: "Assessment", icon: "◎" }, { n: 2, zh: "动作库", en: "Exercises", icon: "◈" }, { n: 3, zh: "课程", en: "Program", icon: "◇" }].map((s) => (
                <button key={s.n} onClick={() => s.n === 3 && !program ? handleGen() : setStep(s.n)} style={{
                  flex: 1, padding: "12px 0", borderRadius: 18, border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  background: step === s.n ? `linear-gradient(140deg, ${P.peach}, ${P.blush})` : "transparent",
                  color: step === s.n ? "#fff" : P.textSoft,
                  boxShadow: step === s.n ? `0 4px 16px ${P.peachGlow}, ${P.shadowInset}` : "none",
                  transform: step === s.n ? "scale(1)" : "scale(0.98)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: step === s.n ? 600 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontSize: 12 }}>{s.icon}</span> {lang === "en" ? s.en : s.zh}
                  </div>
                  {lang === "zh" && <div style={{ fontSize: 9, marginTop: 1, opacity: 0.75 }}>{s.en}</div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 100px", position: "relative", zIndex: 5 }}>

        {/* ═══ STEP 1 ═══ */}
        {step === 1 && (
          <div>
            {/* View toggle - soft 3D pills */}
            <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
              {Object.entries(POSTURAL_CHECKLIST).map(([key, d]) => {
                const a = activeView === key;
                const colors = { sideView: [P.peach, P.peachGlow], frontView: [P.sky, "rgba(160,196,216,0.25)"], backView: [P.lav, "rgba(184,168,208,0.25)"] };
                const [c, g] = colors[key];
                return (
                  <button key={key} onClick={() => setActiveView(key)} style={{
                    padding: "12px 28px", borderRadius: 100, border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    background: a ? `linear-gradient(140deg, ${c}, ${c}dd)` : P.card,
                    color: a ? "#fff" : P.textMid, fontWeight: a ? 600 : 400, fontSize: 14,
                    boxShadow: a ? `0 6px 24px ${g}, ${P.shadowInset}` : P.shadowSm,
                    backdropFilter: a ? "none" : "blur(10px)",
                    transform: a ? "translateY(-2px)" : "translateY(0)",
                  }}>
                    {lang === "en" ? d.titleEn : d.title} {lang === "zh" && <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>{d.titleEn}</span>}
                  </button>
                );
              })}
            </div>

            {/* Sections */}
            {POSTURAL_CHECKLIST[activeView].sections.map((sec, si) => (
              <div key={sec.key} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 8px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: lang === "en" ? "'Quicksand'" : "'Noto Serif SC', serif", fontSize: 19, color: P.text, fontWeight: 700 }}>{lang === "en" ? sec.nameEn : sec.name}</span>
                    {lang === "zh" && <span style={{ fontSize: 11, color: P.textFaint, fontWeight: 400 }}>{sec.nameEn}</span>}
                  </div>
                  {sec.options.some((o) => o.hasRL) && (
                    <div style={{ display: "flex", gap: 6, fontSize: 10, fontWeight: 600, color: P.textFaint, letterSpacing: 1.5 }}>
                      <span style={{ width: 32, textAlign: "center" }}>R</span>
                      <span style={{ width: 32, textAlign: "center" }}>L</span>
                    </div>
                  )}
                </div>

                <div style={{
                  background: P.card, backdropFilter: "blur(20px)",
                  borderRadius: 24, padding: "6px 6px",
                  boxShadow: P.shadow,
                }}>
                  {sec.options.map((opt, oi) => {
                    const on = checks[opt.id];
                    const corr = POSTURAL_CORRECTIONS[opt.id];
                    return (
                      <div key={opt.id}>
                        {oi > 0 && <div style={{ height: 1, background: "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.04) 50%, transparent 95%)", margin: "0 16px" }} />}
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", gap: 6,
                          borderRadius: 18, transition: "background 0.2s",
                          background: on ? "rgba(232,160,144,0.06)" : "transparent",
                        }}>
                          <button onClick={() => toggle(opt.id)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                            {/* Puffy checkbox */}
                            <span style={{
                              width: 22, height: 22, borderRadius: 8, flexShrink: 0, transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                              background: on
                                ? (opt.isNeutral ? `linear-gradient(140deg, ${P.sage}, #B8D0A8)` : corr ? `linear-gradient(140deg, ${P.peach}, ${P.blush})` : `linear-gradient(140deg, ${P.sky}, #B0D0E0)`)
                                : "rgba(0,0,0,0.04)",
                              boxShadow: on ? `0 3px 10px ${opt.isNeutral ? "rgba(168,192,160,0.35)" : corr ? P.peachGlow : "rgba(160,196,216,0.35)"}, ${P.shadowInset}` : `inset 0 1px 3px rgba(0,0,0,0.06)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, color: "#fff", fontWeight: 700,
                              transform: on ? "scale(1)" : "scale(0.95)",
                            }}>{on && "✓"}</span>
                            <div>
                              <span style={{ fontSize: 13, color: on ? P.text : P.textMid, fontWeight: on ? 500 : 400 }}>{lang === "en" ? opt.labelEn : opt.label}</span>
                              {lang === "zh" && <span style={{ fontSize: 10, color: P.textFaint, marginLeft: 6 }}>{opt.labelEn}</span>}
                            </div>
                            {corr && on && (
                              <span style={{
                                fontSize: 9, padding: "3px 10px", borderRadius: 100, fontWeight: 600, whiteSpace: "nowrap",
                                background: `linear-gradient(140deg, ${P.peachSoft}, ${P.blushSoft})`,
                                color: P.peach,
                              }}>{t("矫正", "Corr.")}</span>
                            )}
                          </button>

                          {opt.hasRL ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              {["R", "L"].map((s) => {
                                const a = sides[`${opt.id}_${s}`];
                                return (
                                  <button key={s} onClick={() => { const willBeOn = !sides[`${opt.id}_${s}`]; const otherKey = `${opt.id}_${s === "R" ? "L" : "R"}`; if (willBeOn && !on) toggle(opt.id); if (!willBeOn && !sides[otherKey] && on) toggle(opt.id); toggleSide(opt.id, s); }} style={{
                                    width: 30, height: 30, borderRadius: 10, cursor: "pointer", border: "none",
                                    background: a ? `linear-gradient(140deg, ${P.peach}, ${P.blush})` : "rgba(0,0,0,0.04)",
                                    color: a ? "#fff" : P.textFaint,
                                    fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: a ? `0 3px 12px ${P.peachGlow}, ${P.shadowInset}` : `inset 0 1px 3px rgba(0,0,0,0.05)`,
                                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                                    transform: a ? "scale(1.05)" : "scale(1)",
                                  }}>{s}</button>
                                );
                              })}
                            </div>
                          ) : sec.options.some((o) => o.hasRL) ? <div style={{ width: 68 }} /> : null}
                        </div>
                        {opt.hasNote && on && (
                          <div style={{ padding: "0 18px 10px 50px" }}>
                            <input value={notes[opt.id] || ""} onChange={(e) => setNotes((p) => ({ ...p, [opt.id]: e.target.value }))} placeholder={opt.noteLabel} style={{
                              background: "rgba(0,0,0,0.03)", border: "none", borderRadius: 100,
                              padding: "7px 16px", color: P.text, fontSize: 12, width: "60%", outline: "none",
                              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
                            }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom sticky bar */}
            <div style={{
              position: "sticky", bottom: 16, zIndex: 50,
              background: P.glass, backdropFilter: "blur(24px)",
              borderRadius: 24, padding: "16px 22px",
              boxShadow: P.shadowLg,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16,
            }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[{ l: 1, t: t("初级", "Essential") }, { l: 2, t: t("中级", "Intermediate") }, { l: 3, t: t("高级", "Advanced") }].map((x) => (
                  <button key={x.l} onClick={() => setClientLevel(x.l)} style={{
                    padding: "8px 18px", borderRadius: 100, fontSize: 12, cursor: "pointer", fontWeight: 500, border: "none",
                    background: clientLevel === x.l ? P.text : "rgba(0,0,0,0.04)",
                    color: clientLevel === x.l ? "#fff" : P.textMid,
                    boxShadow: clientLevel === x.l ? `0 3px 12px rgba(74,63,58,0.2), ${P.shadowInset}` : "inset 0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}>{x.t}</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {issueCount > 0 && <span style={{ fontSize: 13, color: P.textMid }}><span style={{ color: P.peach, fontWeight: 700, fontSize: 18 }}>{issueCount}</span> {t("个问题", "issues")}</span>}
                <button onClick={handleGen} style={{
                  padding: "12px 34px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                  background: issueCount > 0 ? `linear-gradient(140deg, ${P.peach}, ${P.blush}, ${P.lav})` : "rgba(0,0,0,0.06)",
                  color: issueCount > 0 ? "#fff" : P.textFaint,
                  boxShadow: issueCount > 0 ? `0 6px 24px ${P.peachGlow}` : "none",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  transform: issueCount > 0 ? "translateY(-1px)" : "none",
                }}>{t("生成课程 →", "Generate →")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {step === 2 && (() => {
          let list = REFORMER_EXERCISES;
          if (filterCat !== "all") list = list.filter((e) => e.cat === filterCat);
          if (search) { const q = search.toLowerCase(); list = list.filter((e) => e.name.includes(q) || e.nameEn.toLowerCase().includes(q) || e.muscles.some((m) => m.toLowerCase().includes(q)) || e.targets.some((m) => m.toLowerCase().includes(q)) || e.pos.toLowerCase().includes(q) || e.springs.toLowerCase().includes(q) || (CATEGORY_LABELS[e.cat]?.en || "").toLowerCase().includes(q) || (CATEGORY_LABELS[e.cat]?.zh || "").includes(q)); }
          return (
            <div>
              {/* Search bar - puffy */}
              <div style={{
                background: P.card, backdropFilter: "blur(20px)",
                borderRadius: 100, padding: "4px 6px", marginBottom: 20,
                boxShadow: P.shadow, display: "flex", alignItems: "center",
              }}>
                <span style={{ padding: "0 12px", fontSize: 16, color: P.textFaint }}>○</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("搜索动作、肌肉...", "Search exercises, muscles...")} style={{ flex: 1, background: "transparent", border: "none", padding: "12px 0", color: P.text, fontSize: 14, outline: "none" }} />
              </div>

              {/* Category pills - scrollable row */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => setFilterCat("all")} style={{
                  padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                  background: filterCat === "all" ? P.text : P.card,
                  color: filterCat === "all" ? "#fff" : P.textMid,
                  boxShadow: filterCat === "all" ? `0 4px 14px rgba(74,63,58,0.2)` : P.shadowSm,
                  backdropFilter: "blur(10px)",
                }}>{t("全部", "All")} {REFORMER_EXERCISES.length}</button>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => {
                  const a = filterCat === k;
                  const cc = CC[k] || {};
                  return (
                    <button key={k} onClick={() => setFilterCat(a ? "all" : k)} style={{
                      padding: "8px 18px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                      background: a ? `linear-gradient(140deg, ${cc.c || P.peach}, ${cc.c || P.peach}cc)` : P.card,
                      color: a ? "#fff" : P.textMid,
                      boxShadow: a ? `0 4px 14px ${cc.glow || P.peachGlow}` : P.shadowSm,
                      backdropFilter: "blur(10px)",
                    }}>{lang === "en" ? v.en : `${v.zh} ${v.en}`}</button>
                  );
                })}
              </div>

              {/* Exercise cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {list.map((ex) => {
                  const cc = CC[ex.cat] || { bg: "rgba(0,0,0,0.03)", c: P.textMid };
                  const open = expEx === ex.id;
                  return (
                    <div key={ex.id} onClick={() => setExpEx(open ? null : ex.id)} style={{
                      background: P.card, backdropFilter: "blur(20px)",
                      borderRadius: 24, padding: 20, cursor: "pointer",
                      boxShadow: open ? P.shadowLg : P.shadow,
                      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                      transform: open ? "scale(1.01)" : "scale(1)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: P.text, marginBottom: 2 }}>{lang === "en" ? ex.nameEn : ex.name}</div>
                          {lang === "zh" && <div style={{ fontSize: 11, color: P.textSoft }}>{ex.nameEn}</div>}
                        </div>
                        {tag(cc.bg, cc.c, lang === "en" ? CATEGORY_LABELS[ex.cat]?.en : `${CATEGORY_LABELS[ex.cat]?.zh} ${CATEGORY_LABELS[ex.cat]?.en}`)}
                      </div>
                      {/* Meta pills row */}
                      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                        {[ex.level === 1 ? "L1 Essential" : ex.level === 2 ? "L2 Intermediate" : "L3 Advanced", `${ex.reps} reps`, ex.springs].map((tt, i) => (
                          <span key={i} style={{
                            fontSize: 11, padding: "4px 12px", borderRadius: 100,
                            background: "rgba(0,0,0,0.03)", color: P.textMid,
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                          }}>{tt}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {ex.muscles.map((m, i) => tag(cc.bg, cc.c, tl(m)))}
                      </div>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                          {ex.targets.map((tg, i) => tag(P.skySoft, P.sky, tl(tg)))}
                        </div>
                        <div style={{ fontSize: 11, color: P.textSoft }}>{t("体位", "Position")}: {tl(ex.pos)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ═══ STEP 3 ═══ */}
        {step === 3 && program && (() => {
          // sessions already in program.sessions
          return (
            <div>
              {/* Issue Summary */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: lang === "en" ? "'Quicksand'" : "'Noto Serif SC', serif", fontSize: 26, color: P.text, marginBottom: 2, textAlign: "center" }}>{t("体态分析摘要", "Postural Analysis Summary")}</div>
                {clientName && <div style={{ fontSize: 13, color: P.textSoft, textAlign: "center", marginBottom: 20 }}>{t(`${clientName} 的个性化矫正方案`, `Personalized Correction Program for ${clientName}`)}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {program.issueDetails.map((d, i) => {
                    const prioColor = d.priority >= 3 ? P.peach : d.priority >= 2 ? P.terra : P.sage;
                    const prioGlow = d.priority >= 3 ? P.peachGlow : d.priority >= 2 ? "rgba(200,160,136,0.2)" : "rgba(168,192,160,0.2)";
                    return (
                      <div key={i} style={{
                        background: P.card, backdropFilter: "blur(20px)",
                        borderRadius: 24, padding: 18, boxShadow: P.shadow,
                        borderLeft: `4px solid ${prioColor}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ width: 10, height: 10, borderRadius: 5, background: `linear-gradient(140deg, ${prioColor}, ${prioColor}aa)`, boxShadow: `0 2px 8px ${prioGlow}`, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: P.text }}>{lang === "en" ? d.issueEn : d.issue}{d.sideLabel}</span>
                        </div>
                        {lang === "zh" && <div style={{ fontSize: 11, color: P.textSoft, marginBottom: 8 }}>{d.issueEn}</div>}
                        <div style={{ fontSize: 12, color: P.textMid, lineHeight: 1.6, marginBottom: 12 }}>{lang === "en" ? d.descEn : d.desc} {lang === "zh" && <span style={{ color: P.textSoft, fontSize: 11 }}>{d.descEn}</span>}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div>
                            {tag(P.terraSoft, P.terra, t("↑ 加强", "↑ Strengthen"))}
                            <div style={{ fontSize: 11, color: P.textMid, marginTop: 3, paddingLeft: 4 }}>{lang === "en" ? d.strengthenEn : d.strengthen} {lang === "zh" && <span style={{ color: P.textSoft, fontSize: 10 }}>{d.strengthenEn}</span>}</div>
                          </div>
                          <div>
                            {tag(P.skySoft, P.sky, t("↓ 拉伸", "↓ Stretch"))}
                            <div style={{ fontSize: 11, color: P.textMid, marginTop: 3, paddingLeft: 4 }}>{lang === "en" ? d.stretchEn : d.stretch} {lang === "zh" && <span style={{ color: P.textSoft, fontSize: 10 }}>{d.stretchEn}</span>}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Session count & phase info */}
              <div style={{
                textAlign: "center", marginBottom: 20, padding: "14px 20px",
                background: P.card, backdropFilter: "blur(20px)",
                borderRadius: 24, boxShadow: P.shadow,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: P.text }}>
                  {t(`共 ${program.totalSessions} 次课程 · 每次约45分钟`, `${program.totalSessions} Sessions · ~45min each`)}
                </div>
                <div style={{ fontSize: 11, color: P.textSoft, marginTop: 4 }}>{t("建议每周2–3次", "Recommended 2–3× per week")}</div>
                <button onClick={() => { setShowEmail(true); setEmailSent(false); setEmailClientName(clientName); }} style={{
                  marginTop: 10, padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer",
                  background: `linear-gradient(140deg, ${P.sky}, ${P.lav})`, color: "#fff",
                  fontSize: 12, fontWeight: 500, boxShadow: "0 4px 16px rgba(160,196,216,0.3)",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}>{t("✉ 发送报告", "✉ Email Report")}</button>
                <button onClick={handleDownloadPDF} style={{
                  marginTop: 6, marginLeft: 8, padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer",
                  background: `linear-gradient(140deg, ${P.peach}, ${P.blush})`, color: "#fff",
                  fontSize: 12, fontWeight: 500, boxShadow: `0 4px 16px ${P.peachGlow}`,
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}>{t("⬇ 下载PDF", "⬇ Download PDF")}</button>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10 }}>
                  {[
                    { label: t("激活期", "Activation"), color: P.peach },
                    { label: t("强化期", "Strengthening"), color: P.sky },
                    { label: t("整合期", "Integration"), color: P.lav },
                  ].map((ph, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: ph.color }} />
                      <span style={{ fontSize: 10, color: P.textSoft }}>{ph.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase filter pills */}
              <div style={{
                display: "flex", gap: 6, marginBottom: 24, justifyContent: "center",
                background: P.card, backdropFilter: "blur(20px)",
                borderRadius: 100, padding: 5, boxShadow: P.shadow,
                maxWidth: 500, margin: "0 auto 24px",
              }}>
                {[
                  { key: "all", label: t("全部", "All") },
                  { key: 0, label: t("激活", "Activation") },
                  { key: 1, label: t("强化", "Strengthen") },
                  { key: 2, label: t("整合", "Integration") },
                ].map((f) => (
                  <button key={String(f.key)} onClick={() => { setActiveWeek(f.key); setExpSession(null); }} style={{
                    flex: 1, padding: "10px 0", borderRadius: 100, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: activeWeek === f.key ? 600 : 400,
                    background: activeWeek === f.key ? `linear-gradient(140deg, ${P.sky}, ${P.lav})` : "transparent",
                    color: activeWeek === f.key ? "#fff" : P.textSoft,
                    boxShadow: activeWeek === f.key ? `0 4px 16px rgba(160,196,216,0.3)` : "none",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}>{f.label}</button>
                ))}
              </div>

              {/* Sessions */}
              {program.sessions.filter(s => activeWeek === "all" || s.phaseIdx === activeWeek).map((session) => {
                const isE = expSession === session.num;
                const phaseGrad = [
                  `linear-gradient(140deg, ${P.peach}, ${P.blush})`,
                  `linear-gradient(140deg, ${P.sky}, ${P.lav})`,
                  `linear-gradient(140deg, ${P.lav}, #C0A8D8)`,
                ];
                const phaseGlow = [P.peachGlow, "rgba(160,196,216,0.3)", "rgba(184,168,208,0.3)"];
                return (
                  <div key={session.num} style={{
                    marginBottom: 16,
                    background: P.card, backdropFilter: "blur(20px)",
                    borderRadius: 28, overflow: "hidden",
                    boxShadow: isE ? P.shadowLg : P.shadow,
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}>
                    <button onClick={() => setExpSession(isE ? null : session.num)} style={{
                      width: "100%", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "transparent", border: "none", cursor: "pointer", color: P.text, textAlign: "left",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 18,
                          background: phaseGrad[session.phaseIdx],
                          boxShadow: `0 4px 16px ${phaseGlow[session.phaseIdx]}, ${P.shadowInset}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, fontWeight: 700, color: "#fff",
                        }}>{session.num}</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600 }}>{lang === "en" ? (session.focusEn || session.focus) : session.focus}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: [P.peachSoft, P.skySoft, P.lavSoft][session.phaseIdx], color: [P.peach, P.sky, P.lav][session.phaseIdx], fontWeight: 500 }}>{lang === "en" ? session.phaseEn : session.phase}</span>
                            <span style={{ fontSize: 11, color: P.textFaint }}>{session.exercises.length} {t("个动作", "exercises")} · {session.totalTime}min</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 16, color: P.textFaint, transform: isE ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▾</span>
                    </button>
                    {isE && (
                      <div style={{ padding: "0 22px 22px" }}>
                        {session.exercises.map((ex, eIdx) => {
                          const cc = CC[ex.cat] || {};
                          return (
                            <div key={eIdx} style={{
                              display: "flex", gap: 14, padding: "14px 0",
                              borderTop: eIdx > 0 ? "1px solid rgba(0,0,0,0.04)" : "none",
                            }}>
                              <span style={{
                                width: 28, height: 28, borderRadius: 10,
                                background: "rgba(0,0,0,0.03)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, color: P.textFaint, fontWeight: 600, flexShrink: 0,
                              }}>{eIdx + 1}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 14, fontWeight: 500, color: P.text }}>{lang === "en" ? ex.nameEn : ex.name}</span>
                                  {lang === "zh" && <span style={{ fontSize: 11, color: P.textFaint }}>{ex.nameEn}</span>}
                                </div>
                                {ex.reasons.length > 0 && (
                                  <div style={{ fontSize: 11, color: P.textSoft, marginBottom: 6, lineHeight: 1.5 }}>
                                    {t("针对", "For")}: {ex.reasons.map(r => lang === "en" ? r.en : r.zh).join(" · ")}
                                  </div>
                                )}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                  {ex.muscles.slice(0, 4).map((m, i) => (
                                    <span key={i} style={{ fontSize: 9, padding: "3px 10px", borderRadius: 100, background: cc.bg || "rgba(0,0,0,0.03)", color: cc.c || P.textSoft }}>{tl(m)}</span>
                                  ))}
                                </div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0, paddingTop: 2 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: P.textMid }}>{ex.sets}×{ex.reps}</div>
                                <div style={{ fontSize: 10, color: P.textFaint }}>{ex.springs} {t("弹簧", "Springs")}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ═══ EMAIL MODAL ═══ */}
        {showEmail && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.25s ease",
          }} onClick={(e) => { if (e.target === e.currentTarget) setShowEmail(false); }}>
            <div style={{
              background: "#fff", borderRadius: 32, padding: "36px 32px 28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)",
              width: "min(420px, 90vw)", position: "relative",
              animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {/* Close button */}
              <button onClick={() => setShowEmail(false)} style={{
                position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 12,
                background: "rgba(0,0,0,0.04)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: P.textSoft, transition: "all 0.2s",
              }}>×</button>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 20, margin: "0 auto 14px",
                  background: `linear-gradient(140deg, ${P.sky}, ${P.lav})`,
                  boxShadow: "0 8px 24px rgba(160,196,216,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                }}>✉</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: P.text }}>OiaOia Pilates</div>
                <div style={{ fontSize: 12, color: P.textSoft, marginTop: 4 }}>
                  {t("发送体态分析与课程报告", "Send postural analysis & program report")}
                </div>
                <div style={{ fontSize: 11, color: P.textFaint }}>
                  {t("PDF报告将通过邮件发送", "PDF report will be sent via email")}
                </div>
              </div>

              {/* Client Name */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: P.textSoft, display: "block", marginBottom: 6 }}>
                  {t("客户姓名", "Client Name")}
                </label>
                <input
                  type="text"
                  value={emailClientName}
                  onChange={(e) => setEmailClientName(e.target.value)}
                  placeholder={t("客户姓名", "Client Name")}
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 16, border: "none",
                    background: "rgba(0,0,0,0.03)", fontSize: 14, color: P.text,
                    outline: "none", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.04)",
                    boxSizing: "border-box", transition: "box-shadow 0.2s",
                  }}
                  onFocus={(e) => e.target.style.boxShadow = `inset 0 2px 6px rgba(0,0,0,0.04), 0 0 0 2px ${P.sky}`}
                  onBlur={(e) => e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.04)"}
                />
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: P.textSoft, display: "block", marginBottom: 6 }}>
                  {t("收件人", "Recipient")}
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="email@example.com"
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 16, border: "none",
                    background: "rgba(0,0,0,0.03)", fontSize: 14, color: P.text,
                    outline: "none", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.04)",
                    boxSizing: "border-box",
                    transition: "box-shadow 0.2s",
                  }}
                  onFocus={(e) => e.target.style.boxShadow = `inset 0 2px 6px rgba(0,0,0,0.04), 0 0 0 2px ${P.sky}`}
                  onBlur={(e) => e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.04)"}
                />
              </div>

              {/* Preview info */}
              <div style={{
                padding: "12px 16px", borderRadius: 16, background: "rgba(0,0,0,0.02)",
                marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, color: P.textSoft, marginBottom: 6 }}>{t("报告内容", "Report Contents")}:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: P.peachSoft, color: P.peach }}>
                    {program?.issueDetails?.length || 0} {t("个体态问题", "issues")}
                  </span>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: P.skySoft, color: P.sky }}>
                    {program?.totalSessions || 0} {t("次课程", "sessions")}
                  </span>
                  {(emailClientName || clientName) && (
                    <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: P.lavSoft, color: P.lav }}>
                      {emailClientName || clientName}
                    </span>
                  )}
                </div>
              </div>

              {/* Send button */}
              <button
                onClick={handleSendEmail}
                disabled={!emailTo || !emailTo.includes("@") || emailSending}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 18, border: "none", cursor: "pointer",
                  fontSize: 15, fontWeight: 600, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  background: emailSent
                    ? `linear-gradient(140deg, ${P.sage}, #A8C8A0)`
                    : emailTo.includes("@")
                      ? `linear-gradient(140deg, ${P.peach}, ${P.blush}, ${P.lav})`
                      : "rgba(0,0,0,0.06)",
                  color: emailSent || emailTo.includes("@") ? "#fff" : P.textFaint,
                  boxShadow: emailTo.includes("@") ? `0 6px 24px ${P.peachGlow}` : "none",
                  transform: emailSending ? "scale(0.97)" : "none",
                  opacity: emailSending ? 0.7 : 1,
                }}
              >
                {emailSent ? t("✓ 已发送", "✓ Sent!") : emailSending ? t("发送中...", "Sending...") : t("发送报告", "Send Report")}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
