import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiCheckboxCircleFill } from '../common/Icons';
import { Input, Textarea } from '../common/Input';
import Button from '../common/Button';
import { useSettings } from '../../hooks/useSettings';
import { submitEnquiry } from '../../services/enquiryService';

export default function EnquiryModal({ isOpen, onClose, initialData = null }) {
  const { settings } = useSettings();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const whatsappNumber = settings?.whatsapp || '+91 93425 53805';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Pre-fill fields if opened from a specific package/vehicle
  useEffect(() => {
    if (initialData) {
      if (initialData.title) {
        const durationText = initialData.duration ? ` (${initialData.duration})` : '';
        setFormData(prev => ({
          ...prev,
          service: initialData.title,
          message: `Hi, I am interested in booking the "${initialData.title}" package${durationText}. Please share customized pricing details.`
        }));
      } else if (initialData.name) {
        const catText = initialData.category ? ` (${initialData.category})` : '';
        setFormData(prev => ({
          ...prev,
          service: initialData.name,
          message: `Hi, I am interested in renting the "${initialData.name}" cab${catText}. Please share tariff options.`
        }));
      }
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    }
    setErrors({});
    setIsSubmitted(false);
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) errs.message = 'Please enter details for your enquiry';
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        // Format WhatsApp message text
        const messageText = `Hello RIR Tours & Travels! 👋\n\nI have submitted an enquiry:\n*Name:* ${formData.fullName}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || 'N/A'}\n*Service/Package:* ${formData.service || 'General Enquiry'}\n*Message:* ${formData.message}\n\nPlease confirm availability and details. Thank you!`;

        const phoneDigits = whatsappNumber.replace(/\D/g, '') || '919342553805';
        const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(messageText)}`;

        // Open WhatsApp chat in a new tab
        window.open(whatsappUrl, 'rir_whatsapp');

        setIsSubmitted(true);
        setFormData({ fullName: '', email: '', phone: '', service: '', message: '' });
      }
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 z-10 overflow-hidden border border-gray-100 my-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase font-sans block mb-1">
                  Concierge Desk
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-display text-primary leading-tight">
                  Enquire & Custom Quote
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close modal"
              >
                <RiCloseLine className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div>
              {isSubmitted ? (
                /* Success Message screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 px-4"
                >
                  <RiCheckboxCircleFill className="text-6xl text-secondary mb-4" />
                  <h4 className="text-xl font-bold text-primary font-display mb-2">
                    Enquiry Submitted Successfully
                  </h4>
                  <p className="text-sm text-gray-500 max-w-sm mb-8 font-sans leading-relaxed">
                    Thank you! Our travel concierge has received your request and will get back to you within 2 business hours.
                  </p>
                  <Button onClick={onClose} variant="primary" className="px-8 rounded-full">
                    Done
                  </Button>
                </motion.div>
              ) : (
                /* Main form layout */
                <form onSubmit={onSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <Input
                      label="Phone Number"
                      id="phone"
                      name="phone"
                      required
                      type="tel"
                      placeholder="e.g. +91 99999 99999"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                    />
                  </div>

                  <Textarea
                    label="Your Message"
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us about your travel dates, passenger count, or special requests..."
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                  />

                  <Button
                    type="submit"
                    variant="gold"
                    className="w-full font-bold mt-2 py-3 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
