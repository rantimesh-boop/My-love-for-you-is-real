import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, Copy, ArrowRight, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// This is a landing page to create your own proposal link
export default function Creator() {
  const [name, setName] = useState('');
  const [challenge, setChallenge] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const generateLink = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your Valentine's name!",
        variant: "destructive"
      });
      return;
    }

    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    params.set('name', name);
    if (challenge) params.set('challenge', 'true');
    
    const finalUrl = `${baseUrl}/proposal?${params.toString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(finalUrl);
    
    toast({
      title: "Link Created! 📋",
      description: "Copied to clipboard. Send it to your Valentine!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
            </div>
            <CardTitle className="font-display text-3xl text-primary">Valentine Creator</CardTitle>
            <CardDescription className="text-base">
              Create a personalized proposal page for your special someone in seconds.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium">Their Name</Label>
              <Input
                id="name"
                placeholder="e.g. Sarah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-6 bg-white border-pink-200 focus-visible:ring-primary/50"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
              <Checkbox 
                id="challenge" 
                checked={challenge}
                onCheckedChange={(c) => setChallenge(c === true)}
                className="w-6 h-6 border-2 border-primary data-[state=checked]:bg-primary"
              />
              <div className="space-y-1">
                <Label htmlFor="challenge" className="font-semibold cursor-pointer">Love Challenge Mode 🎯</Label>
                <p className="text-xs text-muted-foreground">
                  They must catch 10 hearts in a mini-game before seeing the question.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button 
                size="lg" 
                onClick={generateLink}
                className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 text-xl font-bold py-6 shadow-lg shadow-primary/20"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Link
              </Button>
              
              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground bg-white px-2 relative z-10">or</span>
                <div className="h-px bg-gray-200 -mt-2.5 mb-2" />
              </div>

              <Button 
                variant="outline"
                className="w-full border-2 hover:bg-pink-50 text-pink-700 border-pink-200"
                onClick={() => setLocation('/proposal')}
              >
                Preview Default Page <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
