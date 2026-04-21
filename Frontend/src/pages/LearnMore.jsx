import React from 'react';
import { Link } from 'react-router-dom';

const LearnMore = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0fdf4]">

      <main className="flex-grow">
        

        <section className="pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">Greenify</span>?
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Greenify is more than just an app; it's a movement towards a sustainable future. 
            We believe that small, consistent daily actions can collectively create a massive positive impact on our planet.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-white border-y border-green-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Log Your Actions</h3>
                <p className="text-gray-600">
                  Easily record your eco-friendly habits. Whether it's biking to work, taking a shorter shower, or recycling, every action counts.
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Points & Badges</h3>
                <p className="text-gray-600">
                  Turn sustainability into a game. Earn points for your actions, build streaks, and unlock exclusive badges to showcase your commitment.
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">See Your Impact</h3>
                <p className="text-gray-600">
                  Track your progress on the dashboard and compete with others on the global leaderboard to see who can make the biggest difference.
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            Climate change and environmental degradation are overwhelming challenges. Greenify aims to break down the barrier to entry for environmental action. By gamifying sustainability, we empower individuals to realize that their daily choices matter. Together, we are cultivating a greener, healthier planet for generations to come.
          </p>
          <Link
            to="/register"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Join the Movement Today
          </Link>
        </section>

      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌿</span>
                <span className="font-bold text-2xl text-white">Greenify</span>
              </div>
              <p className="text-sm text-gray-400 max-w-sm">
                Empowering individuals to make a global impact through local, sustainable daily actions.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
                <li><Link to="/leaderboard" className="hover:text-green-400 transition">Leaderboard</Link></li>
                <li><Link to="/badges" className="hover:text-green-400 transition">Badges</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-8 text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Greenify. All rights reserved. Let's grow together.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
