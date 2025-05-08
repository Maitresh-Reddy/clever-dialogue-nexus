
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function BlogPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=300&fit=crop" 
                    alt="The Future of Customer Support" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-muted-foreground">May 6, 2025</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">The Future of Customer Support with AI Chatbots</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Discover how AI-powered chatbots are transforming the customer support landscape.
                  </p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=300&fit=crop" 
                    alt="Training AI Models" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-muted-foreground">April 28, 2025</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">Best Practices for Training AI Models with Company Data</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Learn how to effectively train your AI chatbot with proprietary company information.
                  </p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=600&h=300&fit=crop" 
                    alt="ROI of AI Chatbots" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-muted-foreground">April 15, 2025</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">Measuring the ROI of AI Chatbots in Enterprise Settings</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Quantify the benefits of implementing AI chatbot solutions in your organization.
                  </p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496130407-57329f01f769?w=600&h=300&fit=crop" 
                    alt="Customer Experience" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-muted-foreground">April 3, 2025</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">Balancing Automation and Human Touch in Customer Experience</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Strategies for creating the perfect hybrid customer support model.
                  </p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
