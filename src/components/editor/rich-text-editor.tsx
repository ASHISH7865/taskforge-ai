import { Textarea } from "../ui/textarea";

const RichTextEditorComponent = ({ content, setContent }: { content: string, setContent: (content: string) => void }) => {
    return <div className="w-full h-full">
        <Textarea
            className="w-full h-full"
            value={content}
            rows={10}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
        />
    </div>;
};

export default RichTextEditorComponent;
