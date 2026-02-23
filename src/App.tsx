import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import { Loader2 } from "lucide-react";

// Lazy-loaded route components for code-splitting
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Exhibitions = lazy(() => import("./pages/Exhibitions"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const HeroManager = lazy(() => import("./pages/admin/HeroManager"));
const ExhibitionsManager = lazy(() => import("./pages/admin/ExhibitionsManager"));
const JournalManager = lazy(() => import("./pages/admin/JournalManager"));
const GlobalSectionsManager = lazy(() => import("./pages/admin/GlobalSectionsManager"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <Loader2 className="animate-spin text-muted-foreground" size={32} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin login - outside protected wrapper */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="hero" element={<HeroManager />} />
                <Route path="exhibitions" element={<ExhibitionsManager />} />
                <Route path="journal" element={<JournalManager />} />
                <Route path="global" element={<GlobalSectionsManager />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
