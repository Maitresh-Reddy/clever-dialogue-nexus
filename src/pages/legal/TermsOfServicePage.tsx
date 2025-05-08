
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">Last updated: May 8, 2025</p>
            
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the BotLLM website, services, or any applications made available by BotLLM 
              (together, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you don't 
              agree to these Terms, you may not use the Service.
            </p>
            
            <h2>Using Our Service</h2>
            <p>
              You must follow any policies made available to you within the Service. You may use our Service only
              as permitted by law. We may suspend or stop providing our Service to you if you do not comply with 
              our terms or policies or if we are investigating suspected misconduct.
            </p>
            
            <h2>Account Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>
            
            <h2>Service Limitations and Modifications</h2>
            <p>
              We are constantly changing and improving our Service. We may add or remove features or requirements,
              and we may suspend or stop a Service altogether. We may also impose limits on certain features and
              services or restrict your access to parts or all of the Service without notice or liability.
            </p>
            
            <h2>Intellectual Property Rights</h2>
            <p>
              The Service and its original content, features, and functionality are owned by BotLLM and are protected
              by copyright, trademark, and other intellectual property or proprietary rights laws. Our trademarks
              and trade dress may not be used in connection with any product or service without the prior written
              consent of BotLLM.
            </p>
            
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior
              notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall BotLLM, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              access to or use of or inability to access or use the Service.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
              revision is material we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@botllm.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
