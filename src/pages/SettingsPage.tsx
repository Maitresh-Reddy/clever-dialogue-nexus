
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/chat');
    return null;
  }

  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState('openai');
  
  const [employeeAccess, setEmployeeAccess] = useState({
    fileUploads: true,
    imageAnalysis: true,
    documentAnalysis: true
  });

  const handleSaveApiKeys = () => {
    // In a real app, these would be securely saved to a backend
    toast.success('API keys saved successfully');
  };

  const handleModelSelect = (value: string) => {
    setSelectedModel(value);
    toast.success(`Model provider changed to ${value}`);
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6 max-w-4xl">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        
        <Tabs defaultValue="api-keys">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="models">Model Settings</TabsTrigger>
          </TabsList>
          
          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys Configuration</CardTitle>
                <CardDescription>
                  Manage your AI provider API keys. These keys are stored securely and not visible to employees or customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input 
                    id="openai-key"
                    type="password" 
                    placeholder="sk-..." 
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                  <Input 
                    id="gemini-key"
                    type="password" 
                    placeholder="AIza..." 
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ollama-endpoint">Ollama Endpoint</Label>
                  <Input 
                    id="ollama-endpoint"
                    placeholder="http://localhost:11434" 
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    For local LLMs using Ollama
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveApiKeys}>Save API Keys</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Access Control Tab */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>
                  Manage which features are available to employees and customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-medium text-lg">Employee Access:</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="file-upload">File Uploads</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to upload files
                    </p>
                  </div>
                  <Switch 
                    id="file-upload"
                    checked={employeeAccess.fileUploads}
                    onCheckedChange={(checked) => setEmployeeAccess(prev => ({ ...prev, fileUploads: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="image-analysis">Image Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to analyze images
                    </p>
                  </div>
                  <Switch 
                    id="image-analysis"
                    checked={employeeAccess.imageAnalysis}
                    onCheckedChange={(checked) => setEmployeeAccess(prev => ({ ...prev, imageAnalysis: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="doc-analysis">Document Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to analyze documents
                    </p>
                  </div>
                  <Switch 
                    id="doc-analysis"
                    checked={employeeAccess.documentAnalysis}
                    onCheckedChange={(checked) => setEmployeeAccess(prev => ({ ...prev, documentAnalysis: checked }))}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium text-lg">Customer Access:</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customers can only ask company-related queries and cannot access any advanced features.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Access settings saved')}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Model Settings Tab */}
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Settings</CardTitle>
                <CardDescription>
                  Configure which AI models to use for chat and file analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="model-provider">Primary Model Provider</Label>
                    <select
                      id="model-provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                      value={selectedModel}
                      onChange={(e) => handleModelSelect(e.target.value)}
                    >
                      <option value="openai">OpenAI (GPT-4o)</option>
                      <option value="gemini">Google Gemini Pro</option>
                      <option value="ollama">Ollama (Local LLM)</option>
                    </select>
                  </div>
                  
                  {selectedModel === 'openai' && (
                    <div className="space-y-2">
                      <Label htmlFor="openai-model">OpenAI Model</Label>
                      <select
                        id="openai-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4o-mini">GPT-4o-mini (Faster)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedModel === 'gemini' && (
                    <div className="space-y-2">
                      <Label htmlFor="gemini-model">Gemini Model</Label>
                      <select
                        id="gemini-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="gemini-pro-vision">Gemini Pro Vision</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedModel === 'ollama' && (
                    <div className="space-y-2">
                      <Label htmlFor="ollama-model">Ollama Model</Label>
                      <select
                        id="ollama-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="llama3">Llama 3</option>
                        <option value="mistral">Mistral</option>
                        <option value="mixtral">Mixtral</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <textarea
                      id="system-prompt"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="You are BotLLM, an AI assistant that helps with company-related queries..."
                    ></textarea>
                    <p className="text-sm text-muted-foreground">
                      Customize the AI personality and behavior with a system prompt
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Model settings saved')}>Save Model Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
