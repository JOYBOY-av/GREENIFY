import { useState } from 'react';
import { Phone, Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent('Message from ' + form.name + ' via Greenify');
    const body = encodeURIComponent('Name: ' + form.name + '\nEmail: ' + form.email + '\n\nMessage:\n' + form.message);
    window.open('mailto:atharv.vaish2006@gmail.com?subject=' + subject + '&body=' + body);
    toast.success('Opening your mail app...');
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500">We'd love to hear from you. Reach out anytime!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Cards */}
        <div className="flex flex-col gap-4">
          <a
            href="tel:8081704559"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition text-green-600">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mobile</p>
              <p className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition">+91 8081704559</p>
              <p className="text-xs text-green-500 mt-1">Click to call</p>
            </div>
          </a>

          <a
            href="mailto:atharv.vaish2006@gmail.com"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition text-blue-600">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition break-all">atharv.vaish2006@gmail.com</p>
              <p className="text-xs text-blue-500 mt-1">Click to email</p>
            </div>
          </a>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-green-800 mb-1">Response Time</p>
            <p className="text-sm text-green-700">We typically respond within <strong>24 hours</strong>. For urgent matters, please call directly.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name" type="text" required value={form.name} onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message" required value={form.message} onChange={handleChange}
                rows={5} placeholder="Your message..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm"
            >
              {sent ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} /> Message Sent!
                </span>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
