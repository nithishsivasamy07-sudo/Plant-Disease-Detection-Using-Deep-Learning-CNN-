import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Camera, History, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navbar />
      
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <Leaf className="h-24 w-24 text-primary animate-float" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-slide-up">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to={user ? '/detect' : '/auth'}>
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                <Camera className="mr-2 h-5 w-5" />
                {t('hero.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Camera className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">AI-Powered Detection</h3>
            <p className="text-muted-foreground">
              Upload leaf images for instant disease identification using advanced deep learning
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <History className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Track Your History</h3>
            <p className="text-muted-foreground">
              Keep a record of all detections and monitor plant health over time
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '1s' }}>
            <MessageCircle className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Expert Guidance</h3>
            <p className="text-muted-foreground">
              Get instant answers from our AI chatbot about plant diseases and remedies
            </p>
          </div>
        </div>
      </section>

      <ChatBot />
    </div>
  );
};

export default Index;
