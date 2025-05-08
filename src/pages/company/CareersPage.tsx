
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CareersPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Careers</h1>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071901873-411886a10004?w=1200&h=675&fit=crop" 
              alt="BotLLM Office" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Join Our Team</h2>
            <p>
              At BotLLM, we're building the future of AI-powered communications. We're looking for
              talented individuals who are passionate about creating innovative solutions that help
              businesses better serve their customers and employees.
            </p>
            
            <h2>Why BotLLM?</h2>
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Cutting-Edge Technology</h3>
                <p className="text-muted-foreground">
                  Work with the latest advancements in AI, machine learning, and natural language processing.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Flexible Work Environment</h3>
                <p className="text-muted-foreground">
                  Remote-first company with options for in-office collaboration when you need it.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
                <p className="text-muted-foreground">
                  Continuous learning with professional development budgets and mentorship programs.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Competitive Benefits</h3>
                <p className="text-muted-foreground">
                  Comprehensive healthcare, 401(k) matching, generous PTO, and more.
                </p>
              </div>
            </div>
            
            <h2>Open Positions</h2>
            <div className="space-y-6 mt-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold">Senior Machine Learning Engineer</h3>
                <p className="text-muted-foreground mb-4">
                  Help us develop and optimize the AI models that power our chatbot platform.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Remote
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    AI/ML
                  </span>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold">Frontend Developer</h3>
                <p className="text-muted-foreground mb-4">
                  Build intuitive, responsive interfaces for our chatbot administration tools.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Remote
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    React
                  </span>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold">Product Manager</h3>
                <p className="text-muted-foreground mb-4">
                  Define the vision and roadmap for our AI chatbot products.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Hybrid
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Product
                  </span>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </div>
            
            <h2 className="mt-12">Don't see a role for you?</h2>
            <p>
              We're always interested in connecting with talented individuals. Send us your resume
              and tell us how you can contribute to our mission.
            </p>
            
            <div className="mt-6">
              <Link to="/company/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
