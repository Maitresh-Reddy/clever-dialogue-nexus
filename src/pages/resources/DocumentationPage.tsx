
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function DocumentationPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              Welcome to the BotLLM documentation. Here you'll find everything you need to get started
              with our AI-powered chatbot platform.
            </p>
            
            <h2>Getting Started</h2>
            <p>
              Follow these steps to set up your BotLLM instance and start providing 
              AI-powered support to your customers.
            </p>
            
            <ol>
              <li>
                <strong>Create an account:</strong> Sign up for BotLLM using your business email.
              </li>
              <li>
                <strong>Set up your knowledge base:</strong> Upload documents, FAQs, and resources to train your AI.
              </li>
              <li>
                <strong>Customize your chatbot:</strong> Adjust the appearance and behavior to match your brand.
              </li>
              <li>
                <strong>Integrate with your website:</strong> Add a simple code snippet to your site.
              </li>
              <li>
                <strong>Test and refine:</strong> Use our testing tools to ensure quality responses.
              </li>
            </ol>
            
            <h2>API Reference</h2>
            <p>
              Our comprehensive API allows you to integrate BotLLM with your existing systems and workflows.
              Visit our API reference section to learn more about available endpoints and authentication.
            </p>
            
            <h2>Advanced Configuration</h2>
            <p>
              Explore advanced configuration options to customize response behaviors, integrate with third-party
              services, and optimize performance for your specific use case.
            </p>
            
            <h2>Need help?</h2>
            <p>
              If you can't find what you're looking for in our documentation, please contact our support team 
              for assistance.
            </p>
            
            <div className="mt-8">
              <Link to="/company/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
