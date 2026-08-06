'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurReveal, TextReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function SceneInvitation() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { setState } = useCursorState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, filesCount: uploadedFiles.length }),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        setUploadedFiles([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="scene-invitation"
      data-scene="invitation"
      className="section-padding relative overflow-hidden"
      aria-label="Contact form"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / 08 — Start a Project
              </span>
            </BlurReveal>

            <TextReveal
              text="Let's build something extraordinary together."
              className="text-display-md font-display font-black text-[#F8FAFC] mt-3 mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-base text-[#94A3B8] leading-relaxed mb-8">
                Have an ambitious project in mind? We&apos;d love to hear about it. Fill out the form or reach out directly to schedule a technical discovery call.
              </p>
            </BlurReveal>

            <BlurReveal delay={0.45}>
              <div className="space-y-6 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg text-[#3B82F6]">
                    ✉️
                  </span>
                  <div>
                    <span className="text-xs font-mono text-[#64748B] block">Email Us</span>
                    <a href="mailto:hello@innovatechsolutions.com" className="text-[#F8FAFC] font-semibold hover:text-[#3B82F6]">
                      hello@innovatechsolutions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg text-[#06B6D4]">
                    📅
                  </span>
                  <div>
                    <span className="text-xs font-mono text-[#64748B] block">Response SLA</span>
                    <span className="text-[#F8FAFC] font-semibold">
                      Under 24 Hours Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </BlurReveal>
          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-7">
            <BlurReveal delay={0.3}>
              <div className="rounded-3xl glass p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-2xl relative">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <span className="text-6xl mb-4 block">🎉</span>
                      <h3 className="text-display-sm font-display font-black text-[#F8FAFC] mb-2">
                        Message Received!
                      </h3>
                      <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-6">
                        Thank you for reaching out. A senior engineering lead will review your project requirements and respond within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2.5 rounded-full bg-[#3B82F6] text-white text-xs font-semibold"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label className="text-xs font-mono text-[#94A3B8] block mb-2">Your Name *</label>
                          <input
                            {...register('name')}
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6] transition-colors"
                          />
                          {errors.name && (
                            <p className="text-xs text-[#FF5F56] mt-1 font-mono">{errors.name.message}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="text-xs font-mono text-[#94A3B8] block mb-2">Email Address *</label>
                          <input
                            {...register('email')}
                            type="email"
                            placeholder="john@company.com"
                            className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6] transition-colors"
                          />
                          {errors.email && (
                            <p className="text-xs text-[#FF5F56] mt-1 font-mono">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Service Selection */}
                        <div>
                          <label className="text-xs font-mono text-[#94A3B8] block mb-2">Service Needed *</label>
                          <select
                            {...register('service')}
                            className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] transition-colors bg-[#0C0D14]"
                          >
                            <option value="">Select a service...</option>
                            <option value="website">Website Design & Dev</option>
                            <option value="web-apps">SaaS & Web App</option>
                            <option value="android-apps">Android Application</option>
                            <option value="ai-videos">AI Video Production</option>
                            <option value="blogs">Blog Engine & Content</option>
                          </select>
                          {errors.service && (
                            <p className="text-xs text-[#FF5F56] mt-1 font-mono">{errors.service.message}</p>
                          )}
                        </div>

                        {/* Budget */}
                        <div>
                          <label className="text-xs font-mono text-[#94A3B8] block mb-2">Estimated Budget</label>
                          <select
                            {...register('budget')}
                            className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] transition-colors bg-[#0C0D14]"
                          >
                            <option value="">Select range...</option>
                            <option value="5k-10k">$5k – $10k</option>
                            <option value="10k-25k">$10k – $25k</option>
                            <option value="25k-50k">$25k – $50k</option>
                            <option value="50k+">$50k+</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="text-xs font-mono text-[#94A3B8] block mb-2">Project Brief *</label>
                        <textarea
                          {...register('message')}
                          rows={4}
                          placeholder="Tell us about your goals, timelines, and technical requirements..."
                          className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6] transition-colors resize-none"
                        />
                        {errors.message && (
                          <p className="text-xs text-[#FF5F56] mt-1 font-mono">{errors.message.message}</p>
                        )}
                      </div>

                      {/* Dropzone File Upload */}
                      <div>
                        <label className="text-xs font-mono text-[#94A3B8] block mb-2">Attachments (RFP / Wireframes)</label>
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                            isDragActive
                              ? 'border-[#3B82F6] bg-[rgba(59,130,246,0.1)]'
                              : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(59,130,246,0.4)]'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <p className="text-xs text-[#64748B]">
                            {isDragActive
                              ? 'Drop files here...'
                              : 'Drag & drop project files here, or click to browse (Max 10MB)'}
                          </p>
                        </div>
                        {uploadedFiles.length > 0 && (
                          <ul className="mt-2 text-xs text-[#06B6D4] space-y-1">
                            {uploadedFiles.map((f, i) => (
                              <li key={i}>📄 {f.name} ({Math.round(f.size / 1024)} KB)</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        disabled={submitting}
                        onMouseEnter={() => setState('hover-button')}
                        onMouseLeave={() => setState('idle')}
                        className="w-full py-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-body font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? 'Submitting Request...' : 'Send Project Brief →'}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
