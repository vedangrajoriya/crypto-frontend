import React, { useEffect, useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { PredictionForm } from './components/PredictionForm';
import { supabase } from './lib/supabase';
import { Toaster } from 'sonner';
import { LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%)',
      }}
    >
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {session ? (
            <>
              <div className="w-full flex justify-end mb-8">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
              <PredictionForm />
            </>
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;