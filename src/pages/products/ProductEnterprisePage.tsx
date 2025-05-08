
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProductEnterprisePage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">BotLLM Enterprise</h1>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop" 
              alt="BotLLM Enterprise" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>The complete AI solution for large organizations</h2>
            <p>
              BotLLM Enterprise is our flagship product designed for large organizations 
              that need reliable, scalable AI support across multiple departments and user bases.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li><strong>Dedicated Support Team:</strong> 24/7 access to our specialized support engineers</li>
              <li><strong>Custom Integrations:</strong> Connect with your existing systems and workflows</li>
              <li><strong>Advanced Analytics:</strong> Comprehensive dashboards and reporting tools</li>
              <li><strong>Enhanced Security:</strong> Enterprise-grade security features and compliance tools</li>
              <li><strong>Multi-Department Support:</strong> Configure different chatbot instances for various teams</li>
            </ul>
            
            <h3>Pricing</h3>
            <p>
              Our Enterprise solution is priced based on your organization's specific needs.
              Contact our sales team for a customized quote.
            </p>
            
            <div className="mt-8 flex gap-4">
              <Link to="/contact">
                <Button size="lg">Contact Sales</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
