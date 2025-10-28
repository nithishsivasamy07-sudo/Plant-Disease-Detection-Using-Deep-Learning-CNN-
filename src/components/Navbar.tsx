import { Link } from 'react-router-dom';
import { Leaf, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="h-8 w-8 text-primary animate-leaf-sway" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('app.title')}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          {user && (
            <>
              <Link to="/detect" className="text-foreground hover:text-primary transition-colors">
                {t('nav.detect')}
              </Link>
              <Link to="/history" className="text-foreground hover:text-primary transition-colors">
                {t('nav.history')}
              </Link>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')} className={language === 'hi' ? 'bg-accent' : ''}>
                हिन्दी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ta')} className={language === 'ta' ? 'bg-accent' : ''}>
                தமிழ்
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <Button onClick={signOut} variant="outline">
              {t('nav.logout')}
            </Button>
          ) : (
            <Link to="/auth">
              <Button>{t('nav.login')}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;