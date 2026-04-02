import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Who was Pixie?",
  "Tell me about Alice's humanitarian work",
  "What happened on Mother's Day 1973?",
  "How did Alice and Patrick meet?",
  "Tell me about 313 Jackson Avenue",
];

export function AskSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Placeholder response until backend is connected
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you for your question! The AI-powered Q&A feature requires a backend connection to work. Once Lovable Cloud is enabled with the Claude API key, I'll be able to answer questions about the Grainger family letters in detail.",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4 text-center">
          Ask a Question
        </h2>
        <p className="text-center text-mid-gray font-sans text-sm mb-8">
          Ask anything about the Grainger family, their letters, or the places they lived
        </p>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 rounded-full border border-warm-rule bg-card text-sm font-sans text-mid-gray hover:border-amber hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg text-sm font-sans leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber text-primary-foreground"
                    : "bg-card border border-warm-rule text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-warm-rule px-4 py-3 rounded-lg text-sm text-mid-gray">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about the Grainger family…"
            className="flex-1 px-4 py-2.5 rounded border border-warm-rule bg-card text-sm font-sans text-foreground placeholder:text-subtle-gray focus:outline-none focus:border-amber"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="px-3 py-2.5 bg-amber text-primary-foreground rounded hover:bg-amber/90 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
