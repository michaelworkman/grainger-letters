import { useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { answerArchiveQuestion } from "@/lib/archiveAnswer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Who is Pixie?",
  "Tell me about Alice's humanitarian work",
  "What happened on Mother's Day 1973?",
  "How did Alice and Patrick meet?",
  "Tell me about 313 Jackson Avenue",
];

async function streamLocalAnswer({
  prompt,
  onDelta,
  onDone,
}: {
  prompt: string;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const answer = answerArchiveQuestion(prompt);
  const tokens = answer.split(/(\s+)/).filter(Boolean);

  for (const token of tokens) {
    onDelta(token);
    await new Promise((resolve) => setTimeout(resolve, /\s+/.test(token) ? 0 : 18));
  }

  onDone();
}

export function AskSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamLocalAnswer({
        prompt: userMsg.content,
        onDelta: upsert,
        onDone: () => setLoading(false),
      });
    } catch {
      upsert("Sorry, something went wrong while searching the archive. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4 text-center">
          Ask a Question
        </h2>
        <p className="text-center text-mid-gray font-label text-sm mb-8">
          Ask anything about the Grainger family, their letters, or the places they lived
        </p>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 rounded-full border border-warm-rule bg-card text-sm font-label text-mid-gray hover:border-amber hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className={`space-y-4 ${messages.length === 0 ? "mb-3" : "mb-4"}`}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg text-sm font-label leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber text-primary-foreground"
                    : "bg-card border border-warm-rule text-foreground"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose-answer">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-card border border-warm-rule px-4 py-3 rounded-lg text-sm font-label text-mid-gray">
                Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about the Grainger family…"
            className="flex-1 px-4 py-2.5 rounded border border-warm-rule bg-card text-sm font-label text-foreground placeholder:text-subtle-gray focus:outline-none focus:border-amber"
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
