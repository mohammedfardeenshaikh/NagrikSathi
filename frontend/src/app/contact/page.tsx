'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Blobs */}
      <div className="fixed top-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-orange-200/40 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full bg-green-200/30 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-200">NS</div>
            <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>NagrikSathi</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="/submit" className="hover:text-orange-500 transition-colors">Submit Complaint</a>
            <a href="/track" className="hover:text-orange-500 transition-colors">Track Complaint</a>
            <a href="/about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="/contact" className="text-orange-500 font-semibold">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Citizen Support Center
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Contact Support
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Have questions about using the platform, submitting complaints, or looking to speak to an administrator? Fill out the form below.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="glass-card p-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {submitted ? (
            <div className="bg-green-50 border border-green-100 text-green-700 rounded-2xl p-5 text-center text-sm font-medium">
              ✓ Thank you! Your support request has been received. We will get back to you shortly.
              <button 
                onClick={() => setSubmitted(false)}
                className="block mx-auto mt-4 text-xs underline hover:text-green-900"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="msg">Message</label>
                <textarea
                  id="msg"
                  rows={4}
                  placeholder="How can we help you today?"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-sm"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-8 text-center text-xs text-gray-400 flex flex-col items-center gap-3 mt-8">
        <div>
          © {new Date().getFullYear()} NagrikSathi — Empowering citizens through AI-assisted public grievance resolution.
        </div>
        <div className="flex gap-4">
          <a href="/mp-dashboard" className="text-slate-400 hover:text-orange-500 transition-colors font-medium">MP Officer Portal</a>
        </div>
      </footer>
    </div>
  );
}
