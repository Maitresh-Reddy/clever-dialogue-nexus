
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-center mb-4">Pricing Plans</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Choose the right plan for your business needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="border rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Perfect for small businesses just getting started with AI support.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>500 chat conversations/month</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>2 team members</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link to="/signup" className="mt-auto">
                <Button className="w-full">Try Free for 14 Days</Button>
              </Link>
            </div>
            
            {/* Teams Plan */}
            <div className="border rounded-lg p-6 bg-primary/5 flex flex-col relative">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Teams</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">
                For growing teams that need more capacity and features.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>1,000 chat conversations/month</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>5 team members</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Priority email support</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Basic integrations</span>
                </li>
              </ul>
              <Link to="/signup" className="mt-auto">
                <Button className="w-full">Try Free for 14 Days</Button>
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="border rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">Custom</span>
                <span className="text-muted-foreground"></span>
              </div>
              <p className="text-muted-foreground mb-6">
                For large organizations with advanced requirements.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Unlimited conversations</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Custom analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span>Service Level Agreement</span>
                </li>
              </ul>
              <Link to="/contact" className="mt-auto">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is ready to help you find the right plan for your business.
            </p>
            <Link to="/company/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
