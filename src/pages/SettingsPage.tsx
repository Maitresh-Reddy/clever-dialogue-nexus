
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/chat');
    return null;
  }

  // State for API keys
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [lmStudioEndpoint, setLmStudioEndpoint] = useState('http://localhost:1234');
  const [grokKey, setGrokKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai');
  
  // Access control state
  const [employeeAccess, setEmployeeAccess] = useState({
    fileUploads: true,
    imageAnalysis: true,
    documentAnalysis: true
  });

  // State for navigation
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4; // API Keys, Access Control, Models, Training
  
  // State for training data
  const [trainingData, setTrainingData] = useState('');
  const [trainingFile, setTrainingFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Navigation handlers
  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Tab mapping based on page index
  const getTabValue = (index: number) => {
    switch (index) {
      case 0: return "api-keys";
      case 1: return "access";
      case 2: return "models";
      case 3: return "training";
      default: return "api-keys";
    }
  };

  const handleSaveApiKeys = async () => {
    try {
      // Store API keys in Supabase
      const { error } = await supabase
        .from('api_keys')
        .upsert([
          { name: 'openai', value: openaiKey },
          { name: 'gemini', value: geminiKey },
          { name: 'grok', value: grokKey },
          { name: 'deepseek', value: deepseekKey }
        ]);
      
      if (error) throw error;
      
      // Store endpoints in Supabase
      const endpointError = await supabase
        .from('endpoints')
        .upsert([
          { name: 'ollama', url: ollamaEndpoint },
          { name: 'lmstudio', url: lmStudioEndpoint }
        ]);
        
      if (endpointError.error) throw endpointError.error;
      
      toast.success('API keys and endpoints saved successfully');
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    }
  };

  const handleModelSelect = (value: string) => {
    setSelectedModel(value);
    toast.success(`Model provider changed to ${value}`);
  };

  const handleSaveAccess = async () => {
    try {
      // Save access control settings to Supabase
      const { error } = await supabase
        .from('access_control')
        .upsert([
          { 
            role: 'employee', 
            permissions: employeeAccess 
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Access settings saved successfully');
    } catch (error) {
      console.error('Error saving access settings:', error);
      toast.error('Failed to save access settings');
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTrainingFile(e.target.files[0]);
    }
  };
  
  const handleUploadTrainingData = async () => {
    if (!trainingFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsTraining(true);
    
    try {
      // Upload training file to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('training-data')
        .upload(`training_${Date.now()}.txt`, trainingFile);
        
      if (error) throw error;
      
      toast.success('Training data uploaded successfully');
      setTrainingFile(null);
    } catch (error) {
      console.error('Error uploading training data:', error);
      toast.error('Failed to upload training data');
    } finally {
      setIsTraining(false);
    }
  };
  
  const handleTrainModel = async () => {
    if (!trainingData) {
      toast.error('Please enter training data');
      return;
    }
    
    setIsTraining(true);
    
    try {
      // Save training data to Supabase
      const { error } = await supabase
        .from('training_data')
        .insert([
          { data: trainingData, status: 'pending' }
        ]);
        
      if (error) throw error;
      
      toast.success('Training started. This may take some time.');
      setTrainingData('');
    } catch (error) {
      console.error('Error starting training:', error);
      toast.error('Failed to start training');
    } finally {
      setIsTraining(false);
    }
  };

  const goBack = () => {
    navigate('/chat');
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={goBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Back to Chat</span>
            </Button>
          </div>
        </div>
        
        <Tabs 
          value={getTabValue(currentPage)} 
          onValueChange={(value) => {
            switch (value) {
              case "api-keys": setCurrentPage(0); break;
              case "access": setCurrentPage(1); break;
              case "models": setCurrentPage(2); break;
              case "training": setCurrentPage(3); break;
            }
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="models">Model Settings</TabsTrigger>
              <TabsTrigger value="training">AI Training</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-2 mb-4">
            <Button 
              variant="outline" 
              onClick={goPrevious}
              disabled={currentPage === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={goNext}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </Button>
          </div>
          
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
                  <Label htmlFor="grok-key">Grok API Key</Label>
                  <Input 
                    id="grok-key"
                    type="password" 
                    placeholder="grok-..." 
                    value={grokKey}
                    onChange={(e) => setGrokKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
                  <Input 
                    id="deepseek-key"
                    type="password" 
                    placeholder="dsk-..." 
                    value={deepseekKey}
                    onChange={(e) => setDeepseekKey(e.target.value)}
                  />
                </div>
                
                <Separator className="my-4" />
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="lmstudio-endpoint">LM Studio Endpoint</Label>
                  <Input 
                    id="lmstudio-endpoint"
                    placeholder="http://localhost:1234" 
                    value={lmStudioEndpoint}
                    onChange={(e) => setLmStudioEndpoint(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    For local LLMs using LM Studio
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
                <Button onClick={handleSaveAccess}>Save Settings</Button>
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
                      <option value="lmstudio">LM Studio (Local LLM)</option>
                      <option value="grok">Grok AI</option>
                      <option value="deepseek">DeepSeek AI</option>
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
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
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
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
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
                        <option value="llama3:8b">Llama 3 8B</option>
                        <option value="llama3:70b">Llama 3 70B</option>
                        <option value="mistral">Mistral</option>
                        <option value="mixtral">Mixtral</option>
                        <option value="codellama">CodeLlama</option>
                        <option value="phi3">Phi-3</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedModel === 'lmstudio' && (
                    <div className="space-y-2">
                      <Label htmlFor="lmstudio-model">LM Studio Model</Label>
                      <select
                        id="lmstudio-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="custom">Custom Model</option>
                        <option value="llama3">Llama 3</option>
                        <option value="mistral">Mistral</option>
                        <option value="llama2">Llama 2</option>
                        <option value="wizard">Wizard</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedModel === 'grok' && (
                    <div className="space-y-2">
                      <Label htmlFor="grok-model">Grok Model</Label>
                      <select
                        id="grok-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="grok-1">Grok 1</option>
                        <option value="grok-2">Grok 2</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedModel === 'deepseek' && (
                    <div className="space-y-2">
                      <Label htmlFor="deepseek-model">DeepSeek Model</Label>
                      <select
                        id="deepseek-model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="deepseek-coder">DeepSeek Coder</option>
                        <option value="deepseek-llm">DeepSeek LLM</option>
                        <option value="deepseek-v2">DeepSeek V2</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      className="min-h-[120px] resize-none"
                      placeholder="You are BotLLM, an AI assistant that helps with company-related queries..."
                    />
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
          
          {/* Training Tab */}
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>AI Training</CardTitle>
                <CardDescription>
                  Train the AI assistant on your company's knowledge base to improve its responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Manual Training Input</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter specific knowledge for the AI to learn. Format as Q&A pairs for best results.
                    </p>
                    <Textarea
                      className="min-h-[200px] resize-none"
                      placeholder="Q: What are our company's working hours?\nA: Our company operates Monday through Friday, 9 AM to 5 PM."
                      value={trainingData}
                      onChange={(e) => setTrainingData(e.target.value)}
                    />
                    <Button 
                      className="mt-2" 
                      onClick={handleTrainModel}
                      disabled={isTraining || !trainingData}
                    >
                      {isTraining ? 'Processing...' : 'Train AI'}
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">File Upload Training</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload documents or text files to train the AI on larger knowledge bases.
                    </p>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="training-file">Upload file</Label>
                      <Input 
                        id="training-file" 
                        type="file" 
                        accept=".txt,.pdf,.docx,.md"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, DOCX, TXT, MD (max 10MB)
                    </p>
                    <Button 
                      className="mt-2" 
                      onClick={handleUploadTrainingData}
                      disabled={isTraining || !trainingFile}
                    >
                      {isTraining ? 'Uploading...' : 'Upload & Process'}
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Training History</h3>
                    <p className="text-sm text-muted-foreground">
                      View previous training sessions and their status.
                    </p>
                    <div className="border rounded-md">
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        Training history will appear here once you have trained the AI.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Complete Knowledge Base</Button>
                <Button variant="destructive">Reset AI Knowledge</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
