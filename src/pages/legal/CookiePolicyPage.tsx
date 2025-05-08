
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function CookiePolicyPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">Last updated: May 8, 2025</p>
            
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is
              stored in your web browser and allows the Service or a third-party to recognize you and make your
              next visit easier and the Service more useful to you.
            </p>
            
            <h2>How We Use Cookies</h2>
            <p>
              BotLLM uses cookies for various purposes including:
            </p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To authenticate users and prevent fraud</li>
              <li>To analyze how our Service is used</li>
              <li>To improve our Service</li>
              <li>To remember your preferences</li>
              <li>To personalize your experience</li>
            </ul>
            
            <h2>Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function and cannot be switched off in our systems.
              They are usually only set in response to actions made by you which amount to a request for services,
              such as setting your privacy preferences, logging in or filling in forms.
            </p>
            
            <h3>Performance Cookies</h3>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance
              of our site. They help us to know which pages are the most and least popular and see how visitors move
              around the site.
            </p>
            
            <h3>Functionality Cookies</h3>
            <p>
              These cookies enable the website to provide enhanced functionality and personalization. They may be set
              by us or by third party providers whose services we have added to our pages.
            </p>
            
            <h3>Targeting Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners. They may be used by those
              companies to build a profile of your interests and show you relevant adverts on other sites.
            </p>
            
            <h2>Managing Cookies</h2>
            <p>
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so
              vary from browser to browser, and from version to version.
            </p>
            <p>
              Please note, however, that if you delete cookies or refuse to accept them, you might not be able to
              use all of the features we offer, you may not be able to store your preferences, and some of our
              pages might not display properly.
            </p>
            
            <h2>Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the
              new Cookie Policy on this page and updating the "Last updated" date at the top of this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at privacy@botllm.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
