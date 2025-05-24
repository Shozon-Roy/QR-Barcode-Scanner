import { Clipboard, QrCode, Send, Wand2 } from 'lucide-react';

interface CreateCardProps {
  content: string;
  setContent: (content: string) => void;
  onPaste: () => void;
  onCreate: () => void;
}

const CreateCard = ({ content, setContent, onPaste, onCreate }: CreateCardProps) => {
  return (
    <div className="mx-5 mb-6 premium-card">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-3">
          <QrCode size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Create Code</h2>
          <p className="text-muted-foreground text-sm">Enter content to generate</p>
        </div>
      </div>
      
      <div className="mb-5">
        <textarea 
          className="w-full px-4 py-3.5 bg-secondary/50 dark:bg-accent/10 border border-border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/70
                    text-foreground/90 transition-all duration-300"
          rows={3}
          placeholder="Type or paste URL, text or contact details..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between space-x-3">
        <button 
          className="flex-1 py-3 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 
                    text-foreground font-medium rounded-xl transition-all duration-300 shadow-sm"
          onClick={onPaste}
        >
          <Clipboard size={16} />
          <span>Paste</span>
        </button>
        <button 
          className="flex-1 py-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 
                    text-white font-medium rounded-xl transition-all duration-300 shadow-md"
          onClick={onCreate}
        >
          <Wand2 size={16} />
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
};

export default CreateCard;
