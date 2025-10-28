import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Detection {
  id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  description: string;
  remedies: string;
  created_at: string;
}

const History = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadHistory();
  }, [user, navigate]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('disease_detections')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDetections(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('disease_detections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Detection deleted');
      loadHistory();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('history.title')}
        </h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : detections.length === 0 ? (
          <div className="text-center text-muted-foreground animate-fade-in">
            {t('history.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detections.map((detection, index) => (
              <Card 
                key={detection.id} 
                className="animate-slide-up shadow-lg hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <img
                    src={detection.image_url}
                    alt={detection.disease_name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{detection.disease_name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(detection.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {detection.confidence}%
                  </p>
                  <p className="text-sm">{detection.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(detection.created_at), 'PPP')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default History;