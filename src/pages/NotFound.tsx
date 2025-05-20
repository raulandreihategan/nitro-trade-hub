
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-300">404</h1>
            <img 
              src="/lovable-uploads/e85f48d2-871b-4d62-9b08-1223fccb3d74.png" 
              alt="Page not found illustration" 
              className="mx-auto my-6 max-w-xs"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">This Page Does Not Exist</h2>
            <p className="text-gray-600">
              Sorry, the page you are looking for could not be found. It's just an accident that was not intentional.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={goBack} className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={() => navigate('/')} className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
