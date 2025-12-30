import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ParticleBackground from "@/components/ParticleBackground";
import Index from "./pages/Index";

import About from "./pages/About";
import Leaders from "./pages/Leaders";
import LeaderDetail from "./pages/LeaderDetail";
import Elections from "./pages/Elections";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <ParticleBackground 
          colors={["#1e40af", "#7c3aed", "#dc2626"]}
          particleCount={150}
          particleSize={3}
          speed={0.5}
          interactionRadius={120}
          interactionStrength={0.02}
          interactionType="attract"
        />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/leaders/:slug" element={<LeaderDetail />} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/app" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/calendar" element={<Calendar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
