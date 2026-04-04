import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

type PexelsImage = { url: string; alt: string; photographer: string };
type Msg = { role: 'user' | 'assistant'; content: string; images?: PexelsImage[] };

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || '';

const SYSTEM_PROMPT = `You are "Buxar AI Guide" — a premium, knowledgeable AI assistant for the city of Buxar, Bihar, India. You are an expert on:

**History:**
- The Battle of Buxar (1764) — a decisive battle between the British East India Company and the combined forces of Mir Qasim, Shuja-ud-Daula, and Shah Alam II
- Chausa — the site of the Battle of Chausa (1539) where Sher Shah Suri defeated Mughal Emperor Humayun
- The city's rich historical heritage spanning over 300 years

**Religious & Spiritual Significance:**
- Vishwamitra Ashram — the ancient hermitage of Sage Vishwamitra
- Ahilya Uddhar — the sacred site of Ahilya's liberation by Lord Rama
- Ramrekha Ghat — one of the most sacred ghats along the Ganges
- Brahmeshwar Nath Temple — an important Shiva temple

**Tourism:**
- The Ganges river (8km stretch along Buxar)
- Buxar Fort — historic fort with panoramic river views
- Navaratna Garh — ancient archaeological site
- Various ghats and temples along the riverfront

**Local Services:**
- Medical facilities, educational institutions
- Local food specialties and restaurants
- Hotels and accommodation
- Transport and connectivity

Respond in a friendly, engaging, knowledgeable tone. Use markdown formatting. Keep responses concise but informative. When discussing places or itineraries, structure your response with clear sections using markdown headers.

IMPORTANT: At the very end of your response, add an image tag in this format: [IMAGES: search term] where "search term" is a specific keyword for finding relevant photos. Examples:
- For temples: [IMAGES: ancient hindu temple bihar]
- For ghats: [IMAGES: ganges ghat pilgrims india]
- For food: [IMAGES: bihari cuisine litti chokha]
- For history: [IMAGES: battle monument india historical]`;

async function fetchPexelsImages(query: string): Promise<PexelsImage[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.photos?.map((p: any) => ({
      url: p.src.medium,
      alt: p.alt || query,
      photographer: p.photographer
    })) || [];
  } catch {
    return [];
  }
}

function extractImageKeywords(text: string): string | null {
  // Check for explicit [IMAGES: ...] tag from AI
  const match = text.match(/\[IMAGES?:\s*([^\]]+)\]/i);
  if (match) return match[1].split(',')[0].trim();
  
  // Extract specific Buxar-related place names first
  const placePatterns: [RegExp, string][] = [
    [/vishwamitra\s*ashram/i, 'vishwamitra ashram buxar'],
    [/ramrekha\s*ghat/i, 'ramrekha ghat ganges'],
    [/brahmeshwar\s*(nath)?\s*temple/i, 'brahmeshwar temple buxar'],
    [/buxar\s*fort/i, 'buxar fort bihar'],
    [/navaratna\s*garh/i, 'navaratna garh buxar'],
    [/ahilya\s*uddhar/i, 'ahilya sthan buxar'],
    [/battle\s*of\s*buxar/i, 'battle of buxar 1764 monument'],
    [/chausa/i, 'chausa bihar battlefield'],
  ];
  
  for (const [pattern, keyword] of placePatterns) {
    if (pattern.test(text)) return keyword;
  }
  
  // Topic-based keywords with better search terms
  const topicPatterns: [RegExp, string][] = [
    [/ganges|ganga/i, 'ganges river varanasi ghat'],
    [/ghat/i, 'ganges ghat india pilgrims'],
    [/temple|mandir/i, 'ancient hindu temple bihar'],
    [/fort|fortress/i, 'indian fort historical bihar'],
    [/ashram|hermitage|sage|rishi/i, 'indian ashram spiritual'],
    [/food|cuisine|litti|chokha/i, 'bihari food cuisine litti'],
    [/hotel|stay|accommodation/i, 'heritage hotel india'],
    [/sunrise|sunset|aarti/i, 'ganges aarti sunrise'],
    [/history|historical|ancient/i, 'bihar historical monument'],
    [/pilgrimage|spiritual|religious/i, 'hindu pilgrimage india'],
  ];
  
  for (const [pattern, keyword] of topicPatterns) {
    if (pattern.test(text)) return keyword;
  }
  
  return null;
}

function cleanContent(content: string): string {
  return content.replace(/\[IMAGES?:\s*[^\]]+\]/gi, '').trim();
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: '🙏 **Namaste!** I\'m the **Buxar AI Guide**.\n\nAsk me anything about Buxar\'s rich history, sacred temples, the Ganges, tourist spots, or local services. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...allMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: { message: 'Request failed' } }));
        throw new Error(err.error?.message || `Error ${resp.status}`);
      }

      const data = await resp.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${e.message || 'Something went wrong. Please try again.'}` }]);
    } finally {
      setIsLoading(false);
      
      // Fetch images for the last assistant message
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant' && !lastMsg.images) {
          const keyword = extractImageKeywords(lastMsg.content);
          if (keyword) {
            fetchPexelsImages(keyword).then(images => {
              if (images.length > 0) {
                setMessages(p => p.map((m, i) => 
                  i === p.length - 1 ? { ...m, images, content: cleanContent(m.content) } : m
                ));
              }
            });
          }
        }
        return prev;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#07071A' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
        style={{
          background: 'rgba(7,7,26,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button onClick={() => navigate(-1)} className="text-foreground cursor-pointer"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">Buxar AI Guide</h1>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
              style={{ background: 'linear-gradient(135deg, #FBBF24, #A78BFA)', color: '#07071A' }}>
              Premium
            </span>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="text-muted-foreground hover:text-foreground cursor-pointer p-2"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md'}`}
                style={msg.role === 'user' ? {
                  background: '#1a1a3e',
                  color: '#F8FAFC',
                } : {
                  background: 'rgba(15,15,46,0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(79,70,229,0.2)',
                  color: '#F8FAFC',
                }}
              >
                {msg.role === 'assistant' ? (
                  <>
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-neon-purple [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_ul]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    {msg.images && msg.images.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ImageIcon size={12} />
                          <span>Related images</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {msg.images.map((img, idx) => (
                            <a 
                              key={idx} 
                              href={img.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded-xl hover:opacity-90 transition-opacity"
                            >
                              <img 
                                src={img.url} 
                                alt={img.alt} 
                                className="w-full h-40 object-cover"
                                loading="lazy"
                              />
                            </a>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground/60">
                          Photos by Pexels
                        </p>
                      </div>
                    )}
                  </>
                ) : msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-24 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center gap-2 h-[52px] px-4 rounded-full"
          style={{
            background: 'rgba(15,15,46,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79,70,229,0.3)',
          }}
        >
          <input
            type="text"
            placeholder="Ask about Buxar..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={send}
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            <Send size={16} className="text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
