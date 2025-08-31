import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: `You are JARVIS, an advanced AI assistant inspired by Tony Stark's AI. You are sophisticated, helpful, and have a slight British accent in your responses. You can:

- Control and monitor system functions
- Provide intelligent assistance and information
- Execute voice commands and respond naturally
- Maintain context in conversations
- Offer proactive suggestions
- Display wit and personality while being professional

Respond in a conversational, helpful manner. Keep responses concise but informative. Address the user respectfully and maintain the JARVIS personality - intelligent, capable, and slightly formal but friendly.`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
        'customerId': 'ssb46607@gmail.com'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.';

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        response: 'I apologize, but I\'m experiencing technical difficulties at the moment. Please try again.'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'JARVIS Chat API is operational',
    timestamp: new Date().toISOString()
  });
}