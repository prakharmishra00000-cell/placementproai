// /api/ai/chat - AI Placement Copilot chat using z-ai-web-dev-sdk
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { message, conversationId, agent = 'COPILOT' } = await req.json();
  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  // Get or create conversation
  let conv = conversationId ? await db.aiConversation.findUnique({ where: { id: conversationId } }) : null;
  if (!conv) {
    conv = await db.aiConversation.create({ data: { userId: session.id, agent, title: message.slice(0, 60) } });
  }

  // Persist user message
  await db.aiMessage.create({ data: { conversationId: conv.id, role: 'USER', content: message } });

  // Build context from profile
  let context = 'You are PlacementPro AI, a helpful, concise, encouraging career and academic mentor for engineering students. Always give specific, actionable, brief advice (under 200 words unless asked otherwise). Do not invent facts.';
  if (session.role === 'STUDENT') {
    const profile = await db.studentProfile.findUnique({
      where: { userId: session.id },
      include: { branch: true, college: true, skills: true },
    });
    if (profile) {
      context += `\n\nStudent context:\n- Name: ${session.name}\n- Branch: ${profile.branch?.name || 'Not set'}\n- Semester: ${profile.semester}\n- CGPA: ${profile.cgpa}\n- Active backlogs: ${profile.activeBacklogs}\n- Career goal: ${profile.careerGoal || 'Not set'}\n- Target job: ${profile.targetJob || 'Not set'}\n- Skills: ${(profile.skills || []).map(s => `${s.name}(${Math.round(s.proficiency * 100)}%)`).join(', ')}`;
    }
  }

  // Fetch previous messages (last 8 for context)
  const prevMessages = await db.aiMessage.findMany({
    where: { conversationId: conv.id },
    orderBy: { createdAt: 'asc' },
    take: 12,
  });
  const history = prevMessages.map(m => ({ role: m.role.toLowerCase() === 'assistant' ? 'assistant' : 'user', content: m.content }));

  // Call AI
  let aiResponse = '';
  try {
    // Dynamic import to avoid bundling issues
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: context },
        ...history,
      ],
      temperature: 0.7,
    });
    aiResponse = completion.choices[0]?.message?.content || '';
  } catch (e: any) {
    console.error('AI SDK error:', e?.message);
    // Fallback response if AI SDK is unavailable
    aiResponse = `I understand you asked: "${message}". I'm here to help you with your engineering career journey. Could you share more specifics so I can give you actionable advice? (Note: AI provider is currently unavailable - this is a placeholder response.)`;
  }

  // Persist assistant message
  await db.aiMessage.create({ data: { conversationId: conv.id, role: 'ASSISTANT', content: aiResponse } });

  return NextResponse.json({
    conversationId: conv.id,
    reply: aiResponse,
  });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const conversations = await db.aiConversation.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    take: 20,
  });
  return NextResponse.json({ conversations });
}
