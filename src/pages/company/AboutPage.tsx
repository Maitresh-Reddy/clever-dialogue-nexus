
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&fit=crop" 
              alt="BotLLM Team" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Our Mission</h2>
            <p>
              At BotLLM, our mission is to transform how businesses communicate with their customers and employees
              by providing intelligent, AI-powered chatbot solutions that deliver immediate, accurate, and helpful
              responses 24/7.
            </p>
            
            <h2>Our Story</h2>
            <p>
              Founded in 2025, BotLLM began with a simple observation: businesses were spending enormous resources
              on repetitive customer and employee support inquiries that could be better handled through automation,
              while still maintaining a personalized touch.
            </p>
            <p>
              Our founding team—composed of AI researchers, customer experience experts, and enterprise software
              developers—set out to create a chatbot platform that would not only answer questions accurately but
              would also learn and improve over time, becoming an invaluable asset to any organization.
            </p>
            
            <h2>Our Team</h2>
            <p>
              Our diverse team includes experts in machine learning, natural language processing, customer
              experience design, and enterprise software development. Together, we bring decades of experience
              in creating technology solutions that solve real business problems.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="rounded-full overflow-hidden h-32 w-32 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" 
                    alt="John Doe" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">John Doe</h4>
                <p className="text-sm text-muted-foreground">CEO & Co-founder</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden h-32 w-32 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" 
                    alt="Jane Smith" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">Jane Smith</h4>
                <p className="text-sm text-muted-foreground">CTO & Co-founder</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden h-32 w-32 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" 
                    alt="David Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">David Chen</h4>
                <p className="text-sm text-muted-foreground">Head of AI Research</p>
              </div>
            </div>
            
            <h2 className="mt-12">Our Values</h2>
            <ul>
              <li><strong>Innovation:</strong> We constantly push the boundaries of what's possible with AI.</li>
              <li><strong>Quality:</strong> We're committed to delivering products that exceed expectations.</li>
              <li><strong>Customer Focus:</strong> Our customers' success is our success.</li>
              <li><strong>Transparency:</strong> We believe in open communication and ethical AI practices.</li>
            </ul>
            
            <div className="mt-8">
              <h3>Join Our Team</h3>
              <p>
                We're always looking for talented individuals who share our passion for AI and customer experience.
              </p>
              <Link to="/company/careers" className="text-primary hover:underline">
                View Open Positions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
