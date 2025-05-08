
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProductTeamsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">BotLLM Teams</h1>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=675&fit=crop" 
              alt="BotLLM Teams" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>AI-powered support for growing businesses</h2>
            <p>
              BotLLM Teams is perfect for small to medium-sized businesses that want to provide 
              excellent customer support without investing in a large support team.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li><strong>Easy Setup:</strong> Get started in minutes with our intuitive admin panel</li>
              <li><strong>Standard Integrations:</strong> Connect with popular CRM and helpdesk tools</li>
              <li><strong>Basic Analytics:</strong> Track key metrics and improve your support quality</li>
              <li><strong>Team Collaboration:</strong> Allow multiple team members to manage chats</li>
              <li><strong>Knowledge Base:</strong> Train the AI with your product documentation</li>
            </ul>
            
            <h3>Pricing</h3>
            <p>
              BotLLM Teams starts at $99/month for up to 5 team members and 1,000 customer conversations.
              Additional capacity is available at competitive rates.
            </p>
            
            <div className="mt-8 flex gap-4">
              <Link to="/signup">
                <Button size="lg">Start Free Trial</Button>
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
