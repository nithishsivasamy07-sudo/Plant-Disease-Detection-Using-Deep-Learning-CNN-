import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';

const Detect = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('leaf-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('leaf-images')
        .getPublicUrl(fileName);

      // Call AI detection function
      const { data, error } = await supabase.functions.invoke('detect-disease', {
        body: { imageUrl: publicUrl }
      });

      if (error) throw error;

      // Save to history
      await supabase.from('disease_detections').insert({
        user_id: user.id,
        image_url: publicUrl,
        disease_name: data.disease,
        confidence: data.confidence,
        description: data.description,
        remedies: data.remedies,
      });

      setResult(data);
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Detection error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('detect.title')}
          </h1>

          <Card className="animate-slide-up shadow-xl">
            <CardHeader>
              <CardTitle>{t('detect.subtitle')}</CardTitle>
              <CardDescription>
                Upload a clear image of the plant leaf for accurate disease detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {t('detect.upload')}
                    </span>
                  </Button>
                </label>

                {preview && (
                  <div className="w-full max-w-md">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {preview && !result && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full max-w-md"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('detect.analyzing')}
                      </>
                    ) : (
                      t('detect.analyze')
                    )}
                  </Button>
                )}
              </div>

              {result && (
                <Card className="bg-muted animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-2xl">Detection Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">Disease:</h3>
                      <p className="text-xl text-primary">{result.disease}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Confidence:</h3>
                      <p className="text-xl">{result.confidence}%</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Description:</h3>
                      <p>{result.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Remedies:</h3>
                      <p>{result.remedies}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Detect;