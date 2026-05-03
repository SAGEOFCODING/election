/**
 * chatAssistant.js — Handles the interactive AI election assistant widget
 */

class ChatAssistant {
  /**
   * Initializes the chat assistant state and UI
   */
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isLoading = false;
    this.suggestedQuestions = [
      'How do I register to vote?',
      'When is Election Day?',
      'What ID do I need to vote?',
      'How does the Electoral College work?',
      'What is early voting?',
      'How are votes counted?'
    ];
    this.render();
    this.attachEvents();
  }

  /**
   * Renders the chat widget elements to the DOM
   */
  render() {
    const el = document.createElement('div');
    el.id = 'chat-widget';
    el.innerHTML = `
      <div id="chat-toggle" style="width:56px;height:56px;border-radius:50%;background:#2563eb;position:fixed;bottom:20px;right:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(37,99,235,0.4);z-index:1001;transition:all 0.2s ease;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
      <div id="chat-panel" style="display:none;flex-direction:column;position:fixed;bottom:90px;right:20px;width:380px;height:520px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:1000;overflow:hidden;transition:all 0.2s ease;">
        <div style="background:#0f172a;padding:16px;display:flex;justify-content:space-between;align-items:center;">
          <h4 style="margin:0;color:#fff;font-family:var(--font-sans);font-weight:600;">ElectionIQ Assistant</h4>
          <button id="chat-close" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px;">&times;</button>
        </div>
        <div id="chat-messages" style="flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;background:#f8fafc;">
          <div style="background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-radius:12px 12px 12px 2px;padding:10px 14px;font-size:14px;max-width:85%;align-self:flex-start;line-height:1.5;">Hi! I'm your Election Assistant. Ask me anything about voting.</div>
        </div>
        <div id="typing-indicator" style="display:none;padding:8px 16px;color:#64748b;font-size:12px;font-style:italic;">Assistant is typing...</div>
        <div id="chips" style="padding:10px 16px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;border-top:1px solid #f1f5f9;">
          ${this.suggestedQuestions.map((q) => `<button class="chip" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:99px;padding:6px 12px;font-size:12px;cursor:pointer;white-space:nowrap;transition:all 0.2s ease;">${q}</button>`).join('')}
        </div>
        <div style="padding:16px;border-top:1px solid #e2e8f0;display:flex;gap:8px;background:#fff;">
          <input type="text" id="chat-input" placeholder="Ask a question..." style="flex:1;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;outline:none;color:#0f172a;font-family:var(--font-sans);">
          <button id="chat-send" style="background:#2563eb;color:#fff;border:none;border-radius:8px;padding:0 16px;font-weight:600;cursor:pointer;transition:all 0.2s ease;">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
  }

  /**
   * Attaches click and key events to chat elements
   */
  attachEvents() {
    document.getElementById('chat-toggle').onclick = () => this.togglePanel();
    document.getElementById('chat-close').onclick = () => this.togglePanel();
    document.getElementById('chat-send').onclick = () => this.sendMessage();
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    document.querySelectorAll('.chip').forEach((chip) => {
      chip.onclick = () => {
        document.getElementById('chat-input').value = chip.textContent;
        this.sendMessage();
      };
    });
  }

  /**
   * Toggles the visibility of the chat panel
   */
  togglePanel() {
    const panel = document.getElementById('chat-panel');
    this.isOpen = !this.isOpen;
    panel.style.display = this.isOpen ? 'flex' : 'none';
  }

  /**
   * Shows or hides the typing indicator
   * @param {boolean} visible - Whether indicator should be visible
   */
  showTyping(visible) {
    const el = document.getElementById('typing-indicator');
    if (el) {
      el.style.display = visible ? 'flex' : 'none';
    }
  }

  /**
   * Adds a message bubble to the chat history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} text - Message content
   */
  addMessage(role, text) {
    const container = document.getElementById('chat-messages');
    const isUser = role === 'user';
    const div = document.createElement('div');
    div.setAttribute('role', 'log');
    div.setAttribute('aria-live', 'polite');
    
    const bgColor = isUser ? '#2563eb' : '#ffffff';
    const textColor = isUser ? '#ffffff' : '#1e293b';
    const border = isUser ? 'none' : '1px solid #e2e8f0';
    const radius = isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
    const align = isUser ? 'flex-end' : 'flex-start';

    div.style.cssText = `
      background: ${bgColor};
      color: ${textColor};
      border: ${border};
      border-radius: ${radius};
      padding: 10px 14px;
      font-size: 14px;
      max-width: 85%;
      align-self: ${align};
      line-height: 1.55;
      word-wrap: break-word;
      margin: 2px 0;
    `;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Sends the user's message to the API and handles the response
   */
  async sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || this.isLoading) {
      return;
    }

    input.value = '';
    const chips = document.getElementById('chips');
    if (chips) {
      chips.style.display = 'none';
    }

    this.addMessage('user', text);
    this.messages.push({ role: 'user', content: text });

    this.isLoading = true;
    this.showTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: this.messages })
      });

      const data = await res.json();

      if (!res.ok) {
        this.addMessage('assistant', data.error || 'Something went wrong. Please try again.');
        return;
      }

      const reply = data.reply;
      this.addMessage('assistant', reply);
      this.messages.push({ role: 'assistant', content: reply });

      if (typeof gtag === 'function') {
        gtag('event', 'chat_message_sent', { question_length: text.length });
      }

    } catch (err) {
      console.error('Chat error:', err);
      this.addMessage('assistant', 'Connection error. Please check your internet and try again.');
    } finally {
      this.isLoading = false;
      this.showTyping(false);
    }
  }
}

/**
 * Initializes the chat assistant
 */
export function initChat() {
  new ChatAssistant();
}
