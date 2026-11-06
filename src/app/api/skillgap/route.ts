// /api/skillgap - compute skill gap for target role
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const ROLE_SKILLS: Record<string, string[]> = {
  'Software Engineer': ['Python', 'JavaScript', 'React', 'SQL', 'Data Structures', 'Algorithms', 'System Design', 'AWS'],
  'Data Analyst': ['SQL', 'Excel', 'Python', 'Statistics', 'Tableau', 'Power BI'],
  'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Deep Learning', 'Statistics', 'MLOps'],
  'Cybersecurity Analyst': ['Network Security', 'Cryptography', 'Linux', 'Penetration Testing', 'OWASP'],
  'Embedded Engineer': ['Embedded C', 'RTOS', 'Microcontroller', 'Verilog', 'Linux Device Drivers'],
  'VLSI Engineer': ['Verilog', 'SystemVerilog', 'VLSI', 'CMOS', 'FPGA', 'Static Timing Analysis'],
  'Electrical Design Engineer': ['Power Systems', 'ETAP', 'SCADA', 'Control Systems', 'MATLAB', 'Renewable Energy'],
  'Mechanical Design Engineer': ['SolidWorks', 'ANSYS', 'GD&T', 'Thermodynamics', 'Manufacturing', 'AutoCAD'],
  'Production Engineer': ['Lean Manufacturing', 'Six Sigma', 'ERP', 'Quality Control', 'Operations Research'],
  'Civil Design Engineer': ['AutoCAD', 'STAAD Pro', 'Structural Analysis', 'Surveying', 'BIM', 'Construction Management'],
  'BIM Engineer': ['Revit', 'Navisworks', 'BIM 360', 'AutoCAD', 'Dynamo'],
  'Chemical Process Engineer': ['Aspen Plus', 'Heat Transfer', 'Process Control', 'Mass Transfer', 'Safety Engineering'],
  'Quality Engineer': ['Six Sigma', 'ISO 9001', 'Statistical Process Control', 'Quality Audits'],
  'Automation Engineer': ['PLC Programming', 'SCADA', 'Industrial Automation', 'Robotics', 'Python'],
  'Robotics Engineer': ['ROS', 'Python', 'C++', 'Control Systems', 'Computer Vision', 'Kinematics'],
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { skills: true },
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const targetRole = profile.targetJob || 'Software Engineer';
  const required = ROLE_SKILLS[targetRole] || ROLE_SKILLS['Software Engineer'];
  const existing = profile.skills.map(s => s.name);
  const missing = required.filter(r => !existing.includes(r));
  const matched = existing.filter(e => required.includes(e));
  const readiness = Math.round((matched.length / required.length) * 100);

  // Update or create
  let gap = await db.skillGap.findFirst({ where: { studentId: profile.id }, orderBy: { createdAt: 'desc' } });
  if (gap) {
    gap = await db.skillGap.update({
      where: { id: gap.id },
      data: {
        targetRole, requiredSkills: JSON.stringify(required),
        existingSkills: JSON.stringify(existing), missingSkills: JSON.stringify(missing), readinessPct: readiness,
      },
    });
  } else {
    gap = await db.skillGap.create({
      data: {
        studentId: profile.id, targetRole, requiredSkills: JSON.stringify(required),
        existingSkills: JSON.stringify(existing), missingSkills: JSON.stringify(missing), readinessPct: readiness,
      },
    });
  }

  // Suggest learning paths for missing skills (basic suggestions)
  const learningPaths = missing.map(skill => ({
    skill,
    resources: [`NPTEL course on ${skill}`, `Coursera specialization: ${skill}`, `Practice projects: ${skill}`],
    estimatedHours: 40,
  }));

  return NextResponse.json({
    targetRole,
    requiredSkills: required,
    existingSkills: existing,
    missingSkills: missing,
    matchedSkills: matched,
    readinessPct: readiness,
    learningPaths,
    roleOptions: Object.keys(ROLE_SKILLS),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  const { targetRole } = await req.json();
  await db.studentProfile.update({ where: { userId: session.id }, data: { targetJob: targetRole } });
  return NextResponse.json({ ok: true });
}
