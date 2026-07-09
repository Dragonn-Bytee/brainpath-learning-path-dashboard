import { Bot, Send, Sparkles } from 'lucide-react';
import './AIAssistant.css';

export default function AIAssistant() {
    return (
        <div className="glass-panel card-base ai-assistant">
            <div className="ai-header">
                <div className="ai-title">
                    <div className="ai-icon-pulse">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3>AI Learning Assistant</h3>
                        <p>Ask me to explain concepts or suggest courses</p>
                    </div>
                </div>
                <button className="icon-btn">
                    <Sparkles size={18} className="text-primary" />
                </button>
            </div>

            <div className="chat-container">
                <div className="message bot-message">
                    <div className="msg-avatar">
                        <Bot size={16} />
                    </div>
                    <div className="msg-bubble">
                        <p>Hello Alex! I noticed you're struggling with Backpropagation in the Neural Networks module. Would you like me to explain it with a simpler analogy?</p>
                        <div className="msg-actions">
                            <button className="pill-btn">Yes, please explain</button>
                            <button className="pill-btn">Suggest reading materials</button>
                        </div>
                    </div>
                </div>

                <div className="message user-message">
                    <div className="msg-bubble">
                        <p>Yes, please explain it using a water flow analogy if possible.</p>
                    </div>
                </div>

                <div className="message bot-message">
                    <div className="msg-avatar">
                        <Bot size={16} />
                    </div>
                    <div className="msg-bubble">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-input-wrapper">
                <input type="text" placeholder="Ask anything..." className="chat-input" />
                <button className="send-btn">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
