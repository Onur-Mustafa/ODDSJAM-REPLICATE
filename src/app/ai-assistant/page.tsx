
import { AIAssistantForm } from "@/components/ai-assistant-form";

export const metadata = {
  title: "AI Betting Assistant",
};

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <AIAssistantForm />
    </div>
  );
}
