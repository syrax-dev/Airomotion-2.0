import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Contact.css';
import { submitEnquiry } from '../api/api';

const sanitizeClientText = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    productCategory: '',
    propertyType: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full Name is required.';
        else if (!/^[A-Za-z\s]+$/.test(value.trim())) error = 'Full Name should only contain letters and spaces.';
        break;
      case 'email':
        if (!value) error = 'Email Address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email format.';
        break;
      case 'phone':
        if (!value) error = 'Phone Number is required.';
        else if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) error = 'Enter a valid 10-digit mobile number.';
        break;
      case 'productCategory':
        if (!value) error = 'Please select a Product Category.';
        break;
      case 'propertyType':
        if (!value) error = 'Please select a Property Type.';
        break;
      case 'message':
        if (!value) error = 'Message is required.';
        else if (value.trim().length < 20) error = 'Message must be at least 20 characters.';
        break;
      default: break;
    }
    return error;
  };

  const validateForm = () => {
    const tempErrors = {};
    let formIsValid = true;
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) { tempErrors[key] = err; formIsValid = false; }
    });
    setErrors(tempErrors);
    setIsValid(formIsValid);
    return formIsValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'phone'
      ? value
        .replace(/\D/g, '')
        .slice(0, 10)
        .replace(/(\d{5})(\d)/, '$1 $2')
      : value;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const honeypot = e.currentTarget.elements.website?.value || '';
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    setShowErrors(true);

    if (!validateForm()) return;

    const doSubmit = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const payload = {
          name: sanitizeClientText(formData.fullName),
          phone: sanitizeClientText(formData.phone.replace(/\D/g, '')),
          email: sanitizeClientText(formData.email).toLowerCase(),
          productCategory: sanitizeClientText(formData.productCategory),
          propertyType: sanitizeClientText(formData.propertyType),
          message: sanitizeClientText(formData.message),
          website: honeypot,
        };
        await submitEnquiry(payload);
        setErrors({});
        setTouched({});
        setShowErrors(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to send enquiry. Please try again.';
        setErrors(prev => ({ ...prev, form: msg }));
      } finally {
        setIsLoading(false);
      }
    };

    doSubmit();
  };

  const handleReset = () => {
    setFormData({ fullName: '', email: '', phone: '', productCategory: '', propertyType: '', message: '' });
    setErrors({});
    setTouched({});
    setShowErrors(false);
    setIsValid(false);
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page">
      <section className="bw-page-header contact-hero">
        <div className="lx-container">
          <span className="bw-eyebrow">Contact</span>
          <h1>
            Let's start our <em>technology with you.</em>
          </h1>
          <p>
            Tell us about your requirements. A principal will personally respond within one business day.
          </p>
        </div>
      </section>

      <ScrollReveal animation="reveal-on-scroll">
        <section className="section ct-section">
          <div className="lx-container">
            <div className="ct-layout">

            <div className="ct-info">
              <h2 className="ct-info-heading"><em>AIROMOTION</em> STORE.</h2>
              <p className="ct-info-sub">
                Visits by appointment only. We welcome architects, interior designers and private clients.
              </p>

              <div className="ct-info-blocks">
                <div className="ct-info-block">
                  <span className="ct-info-label">Address</span>
                  <strong className="ct-info-value">
                    LIMANI TECHNOLOGIES<br />
                    Gandhinagar, Gujarat India – 382610
                  </strong>
                </div>
                <div className="ct-info-block">
                  <span className="ct-info-label">Email</span>
                  <strong className="ct-info-value">
                    <a href="mailto:connect@airomotion.com">connect@airomotion.com</a>
                  </strong>
                </div>
                <div className="ct-info-block">
                  <span className="ct-info-label">Phone</span>
                  <strong className="ct-info-value">
                    <a href="tel:+919712925077">(+91) 97129 25077</a>
                    <br />
                    <a href="tel:+919712925077">(+91) 94092 67235</a>
                  </strong>
                </div>
                <div className="ct-info-block">
                  <span className="ct-info-label">Hours</span>
                  <strong className="ct-info-value">Mon - Sat · 10:00 - 19:00</strong>
                </div>
              </div>
            </div>

            <div className="ct-form-col">
              {isSubmitted ? (
                <div className="ct-form-card ct-success">
                  <span className="ct-success-icon">✓</span>
                  <h3>Enquiry Sent</h3>
                  <p>Thank you, <strong>{formData.fullName}</strong>. Our team will contact you at <strong>{formData.email}</strong> within 24 hours.</p>
                  <button className="ct-submit-btn" onClick={handleReset} style={{ marginTop: '1rem' }}>
                    Send Another <span>→</span>
                  </button>
                </div>
              ) : (
                <form className="ct-form-card ct-form" onSubmit={handleSubmit} noValidate>
                  <input
                    className="honeypot-field"
                    type="text"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Full Name + Phone */}
                  <div className="ct-row">
                    <div className={`ct-field${touched.fullName && errors.fullName ? ' ct-field--err' : ''}`}>
                      <label className="ct-label" htmlFor="ctFullName">Full Name</label>
                      <input id="ctFullName" name="fullName" type="text" className="ct-input"
                        value={formData.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="Your Name"/>
                      {showErrors && errors.fullName && <span className="ct-error">{errors.fullName}</span>}
                    </div>
                    <div className={`ct-field${showErrors && errors.phone ? ' ct-field--err' : ''}`}>
                      <label className="ct-label" htmlFor="ctPhone">Phone</label>
                      <input id="ctPhone" name="phone" type="tel" className="ct-input"
                        value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                        inputMode="numeric" maxLength="11" placeholder="xxxxx xxxxx" />
                      {showErrors && errors.phone && <span className="ct-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Email – full width */}
                  <div className={`ct-field${showErrors && errors.email ? ' ct-field--err' : ''}`}>
                    <label className="ct-label" htmlFor="ctEmail">Email</label>
                    <input id="ctEmail" name="email" type="email" className="ct-input"
                      value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="name@example.com" />
                    {showErrors && errors.email && <span className="ct-error">{errors.email}</span>}
                  </div>

                  {/* Project Type + Property Type */}
                  <div className="ct-row">
                    <div className={`ct-field${showErrors && errors.productCategory ? ' ct-field--err' : ''}`}>
                      <label className="ct-label" htmlFor="ctProjectType">Product Category</label>
                      <div className="ct-select-wrap">
                        <select id="ctProjectType" name="productCategory" className="ct-input ct-select"
                          value={formData.productCategory} onChange={handleChange} onBlur={handleBlur}>
                          <option value="">Select</option>
                          <option value="automation">Smart Automation</option>
                          <option value="security">Smart Security</option>
                          <option value="energy">Energy Management</option>
                        </select>
                        <span className="ct-chevron">›</span>
                      </div>
                      {showErrors && errors.productCategory && <span className="ct-error">{errors.productCategory}</span>}
                    </div>
                    <div className={`ct-field${showErrors && errors.propertyType ? ' ct-field--err' : ''}`}>
                      <label className="ct-label" htmlFor="ctPropertyType">Property Type</label>
                      <div className="ct-select-wrap">
                        <select id="ctPropertyType" name="propertyType" className="ct-input ct-select"
                          value={formData.propertyType} onChange={handleChange} onBlur={handleBlur}>
                          <option value="">Select</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Villa</option>
                          <option value="office">Office</option>
                          <option value="commercial">Commercial Building</option>
                          <option value="industrial">Industrial Facility</option>
                        </select>
                        <span className="ct-chevron">›</span>
                      </div>
                      {showErrors && errors.propertyType && <span className="ct-error">{errors.propertyType}</span>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`ct-field${showErrors && errors.message ? ' ct-field--err' : ''}`}>
                    <label className="ct-label" htmlFor="ctMessage">Message</label>
                    <textarea id="ctMessage" name="message" className="ct-input ct-textarea" rows="4"
                      placeholder="Tell us about your project, timeline and any specific systems of interest..."
                      value={formData.message} onChange={handleChange} onBlur={handleBlur} />
                    {showErrors && errors.message && <span className="ct-error">{errors.message}</span>}
                  </div>

                  {/* Submit */}
                  <div className="ct-submit-row">
                    {errors.form && <div className="ct-error" style={{ marginBottom: '0.5rem' }}>{errors.form}</div>}
                    <button type="submit" className="ct-submit-btn" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="btn-spinner" aria-hidden="true"></span>
                          Sending…
                        </>
                      ) : (
                        <>Send Enquiry <span>→</span></>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>
      </ScrollReveal>

    </div>
  );
};

export default Contact;
