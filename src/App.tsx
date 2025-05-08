
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ChatPage from "@/pages/ChatPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import PricingPage from "@/pages/PricingPage";
import ProductEnterprisePage from "@/pages/products/ProductEnterprisePage";
import ProductTeamsPage from "@/pages/products/ProductTeamsPage";
import ContactPage from "@/pages/company/ContactPage";
import AboutPage from "@/pages/company/AboutPage";
import CareersPage from "@/pages/company/CareersPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import CookiePolicyPage from "@/pages/legal/CookiePolicyPage";
import DocumentationPage from "@/pages/resources/DocumentationPage";
import TutorialsPage from "@/pages/resources/TutorialsPage";
import BlogPage from "@/pages/resources/BlogPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:id" element={<ChatPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Products */}
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/products/enterprise" element={<ProductEnterprisePage />} />
              <Route path="/products/teams" element={<ProductTeamsPage />} />
              
              {/* Company */}
              <Route path="/company/contact" element={<ContactPage />} />
              <Route path="/company/about" element={<AboutPage />} />
              <Route path="/company/careers" element={<CareersPage />} />
              
              {/* Resources */}
              <Route path="/resources/documentation" element={<DocumentationPage />} />
              <Route path="/resources/tutorials" element={<TutorialsPage />} />
              <Route path="/resources/blog" element={<BlogPage />} />
              
              {/* Legal */}
              <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/terms" element={<TermsOfServicePage />} />
              <Route path="/legal/cookies" element={<CookiePolicyPage />} />
              
              {/* Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
