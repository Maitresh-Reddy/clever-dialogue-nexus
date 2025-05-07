
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <span className="text-xl font-bold">BotLLM</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link to="/#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/#about" className="text-sm hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/#products" className="text-sm hover:text-primary transition-colors">
                Products
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Advanced AI Chatbot for <br />
          <span className="text-primary">Enterprise Support</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Enhance your customer service and employee assistance with our powerful AI chatbot platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="px-8">Employee Login</Button>
          </Link>
          <Link to="/login" state={{ isCustomer: true }}>
            <Button size="lg" variant="outline" className="px-8">Customer Access</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Customer Support</h3>
              <p className="text-muted-foreground">
                Our AI chatbot understands customer inquiries and provides accurate, helpful responses instantly.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Employee Assistance</h3>
              <p className="text-muted-foreground">
                Help your team access critical information and solve issues quickly with AI-powered internal support.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conversation History</h3>
              <p className="text-muted-foreground">
                Store and access previous conversations for better context and continuity in customer relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About BotLLM</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <p className="text-lg mb-4">
                BotLLM is a cutting-edge AI chatbot solution designed for enterprises that need reliable customer support and employee assistance.
              </p>
              <p className="text-lg mb-4">
                Our platform leverages the latest advancements in natural language processing to understand and respond to queries with human-like comprehension.
              </p>
              <p className="text-lg">
                Founded in 2025, we've helped hundreds of businesses improve their customer satisfaction scores and internal knowledge sharing.
              </p>
            </div>
            <div className="flex-1 bg-muted aspect-video rounded-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">Company Video</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">BotLLM Enterprise</h3>
              <p className="text-muted-foreground mb-4">
                Complete solution for large businesses with dedicated support and custom integrations.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">BotLLM Teams</h3>
              <p className="text-muted-foreground mb-4">
                Perfect for small to medium businesses looking for an AI-powered customer service solution.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Enterprise</Link></li>
                <li><Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Teams</Link></li>
                <li><Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</Link></li>
                <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/company" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/company" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="/company" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BotLLM. All rights reserved.</p>
            <p className="mt-2">
              Authorized company email domains for employee accounts: botllm.com, company.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
