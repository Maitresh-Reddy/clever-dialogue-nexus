
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function TutorialsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Tutorials</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              Learn how to get the most out of BotLLM with our step-by-step tutorials.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Getting Started with BotLLM</h3>
                <p className="text-muted-foreground mb-4">
                  Learn the basics of setting up your first AI chatbot for customer support.
                </p>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Beginner
                </span>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Training Your AI With Custom Data</h3>
                <p className="text-muted-foreground mb-4">
                  Improve response accuracy by training your chatbot with your own content.
                </p>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Intermediate
                </span>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Integrating with Your CRM</h3>
                <p className="text-muted-foreground mb-4">
                  Connect BotLLM to your customer relationship management system.
                </p>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Advanced
                </span>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Analytics and Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to use data insights to improve your customer support.
                </p>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Intermediate
                </span>
              </div>
            </div>
            
            <h2 className="mt-12">Video Tutorials</h2>
            <p>
              Watch our video tutorials for visual step-by-step guidance on using BotLLM.
            </p>
            
            <div className="aspect-video mt-4 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Video tutorials coming soon</p>
            </div>
            
            <h2 className="mt-12">Request a Tutorial</h2>
            <p>
              Don't see what you're looking for? Let us know what tutorial would help you make 
              the most of BotLLM.
            </p>
            
            <div className="mt-4">
              <Link to="/company/contact" className="text-primary hover:underline">
                Request a Tutorial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
