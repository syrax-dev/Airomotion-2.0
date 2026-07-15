import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Services.css';
import { submitRegistration } from '../api/api';

const Services = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    productCategory: '',
    productName: '',
    modelNumber: '',
    serialNumber: '',
    purchaseDate: '',
    installationDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const servicesList = [
    {
      num: '01',
      title: 'Home Automation',
      desc: 'Whole-home design and orchestration — every system, one experience.',
      deliverables: [
        'Smart Switch Planning',
        'Lighting Automation',
        'Sensor Integration',
        'Smart Control Panels',
        'Motorized Curtains & Blinds',
        'Multi-room Audio Systems',
        'Centralized Smart Control'
      ]
    },
    {
      num: '02',
      title: 'Security Integration',
      desc: 'Cameras, locks, perimeter and alarm systems unified with the home.',
      deliverables: [
        'Smart Door Locks',
        'CCTV System Design',
        'Smart Video Doorbells',
        'Access Control Systems',
        'Gate Automation',
        'Boom Barrier Systems',
        'Security Monitoring Solutions'
      ]
    },
    {
      num: '03',
      title: 'Energy Solutions',
      desc: 'Solar Hybrid UPS, solar panel, solar battery - Control Energy, Control Costs.',
      deliverables: [
        'Solar Hybrid UPS',
        'Solar Panel Installation',
        'Solar Battery Solutions',
        'Energy Monitoring Systems',
        'Power Optimization',
        'Sustainable Energy Planning'
      ]
    },
    {
      num: '04',
      title: 'Professional Installation',
      desc: 'Product installation by our well trained team. Clean, certified, on time.',
      deliverables: [
        'Site Assessment',
        'Wiring & Infrastructure',
        'Device Installation',
        'System Configuration',
        'Quality Testing',
        'Final Handover'
      ]
    },
    {
      num: '05',
      title: 'Product Service',
      desc: 'Scheduled service, remote diagnostics and proactive firmware care.',
      deliverables: [
        'Preventive Maintenance',
        'Remote Diagnostics',
        'Firmware Updates',
        'System Health Checks',
        'Troubleshooting',
        'Technical Support'
      ]
    },
    {
      num: '06',
      title: 'Maintenance',
      desc: 'Yearly product maintenance subscriptions.',
      deliverables: [
        'Requirement Analysis',
        'Solution Planning',
        'Product Recommendations',
        'Budget Planning',
        'Future Expansion Strategy'
      ]
    }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required.';
        return /^[A-Za-z\s]+$/.test(value.trim()) ? '' : 'Full name should only contain letters and spaces.';
      case 'phone':
        return value.trim()
          ? /^[6-9]\d{9}$/.test(value.trim())
            ? ''
            : 'Enter a valid 10-digit phone number.'
          : 'Phone number is required.';
      case 'email':
        return value.trim()
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
            ? ''
            : 'Enter a valid email address.'
          : 'Email is required.';
      case 'address':
        return value.trim() ? '' : 'Address is required.';
      case 'productCategory':
        return value ? '' : 'Please select a product category.';
      case 'productName':
        return value.trim() ? '' : 'Product name is required.';
      case 'modelNumber':
        return value.trim() ? '' : 'Model number is required.';
      case 'serialNumber':
        return value.trim() ? '' : 'Serial number is required.';
      case 'purchaseDate':
        return value ? '' : 'Purchase date is required.';
      case 'installationDate':
        return value ? '' : 'Installation date is required.';
      case 'notes':
        return value.trim().length >= 10 ? '' : 'Please add a brief note about your installation.';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) validationErrors[field] = error;
    });
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (showErrors) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  return (
    <div className="services-page">
      <section className="bw-page-header">
        <div className="lx-container">
          <span className="bw-eyebrow">Services</span>
          <h1>
            From <em>concept</em> to lifetime <em>trust.</em>
          </h1>
          <p>
            Our team, accountable from the first step through Installation update — ensuring reliability for the life of your home.
          </p>
        </div>
      </section>


      {/* 3. SERVICES GRID — Nordhaus style */}
      <ScrollReveal animation="reveal-on-scroll">
        <section className="section svc-grid-section">
          <div className="lx-container">
            <div className="svc-grid-header">
              <span className="svc-grid-eyebrow">What We Offer</span>
              <h2 className="svc-grid-heading">Six disciplines. One ecosystem.</h2>
            </div>
            <div className="svc-grid">
            {servicesList.map((service) => (
              <div key={service.num} className="svc-grid-card">
                <span className="svc-grid-num">{service.num}</span>
                <h3 className="svc-grid-title">{service.title}</h3>
                <p className="svc-grid-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal animation="reveal-on-scroll" delay="delay-1">
        <section className="section section-dark">
        <div className="container" style={{ maxWidth: '980px' }}>
          <div className="section-head center">
            <span className="eyebrow" style={{ opacity: 0.7 }}>Warranty</span>
            <h2>Product <em>Registration.</em></h2>
            <p>Register your hardware to activate warranty coverage and engineering support.</p>
          </div>
          {submitSuccess ? (
            <div className="form-success-message">
              <h3>Registration details received</h3>
              <p>Thanks! We’ll review your registration and contact you if we need more information.</p>
            </div>
          ) : (
            <form className="form-card reveal" noValidate onSubmit={(e) => {
              e.preventDefault();
              setShowErrors(true);
              const validationErrors = validateForm();
              if (Object.keys(validationErrors).length !== 0) return;

              const doSubmit = async () => {
                setIsLoading(true);
                try {
                  await submitRegistration({
                    name: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    productCategory: formData.productCategory,
                    productName: formData.productName,
                    modelNumber: formData.modelNumber,
                    serialNumber: formData.serialNumber,
                    purchaseDate: formData.purchaseDate,
                    installationDate: formData.installationDate,
                    notes: formData.notes
                  });
                  setSubmitSuccess(true);
                } catch (err) {
                  const msg = err?.response?.data?.message || 'Failed to submit registration. Please try again.';
                  setErrors(prev => ({ ...prev, form: msg }));
                } finally {
                  setIsLoading(false);
                }
              };

              doSubmit();
            }}>
              <div className="form-grid">
                <div className={`form-row${showErrors && errors.fullName ? ' form-row--error' : ''}`}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {showErrors && errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className={`form-row${showErrors && errors.phone ? ' form-row--error' : ''}`}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {showErrors && errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className={`form-row${showErrors && errors.email ? ' form-row--error' : ''}`}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {showErrors && errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className={`form-row${showErrors && errors.address ? ' form-row--error' : ''}`}>
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {showErrors && errors.address && <span className="form-error">{errors.address}</span>}
                </div>
                <div className={`form-row${showErrors && errors.productCategory ? ' form-row--error' : ''}`}>
                  <label htmlFor="productCategory">Product Category</label>
                  <select
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select category</option>
                    <option>Smart Automation</option>
                    <option>Smart Security</option>
                    <option>Energy Management</option>
                  </select>
                  {showErrors && errors.productCategory && <span className="form-error">{errors.productCategory}</span>}
                </div>
                <div className={`form-row${showErrors && errors.productName ? ' form-row--error' : ''}`}>
                  <label htmlFor="productName">Product Name</label>
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleChange}
                  />
                  {showErrors && errors.productName && <span className="form-error">{errors.productName}</span>}
                </div>
                <div className={`form-row${showErrors && errors.modelNumber ? ' form-row--error' : ''}`}>
                  <label htmlFor="modelNumber">Model Number</label>
                  <input
                    id="modelNumber"
                    name="modelNumber"
                    type="text"
                    value={formData.modelNumber}
                    onChange={handleChange}
                  />
                  {showErrors && errors.modelNumber && <span className="form-error">{errors.modelNumber}</span>}
                </div>
                <div className={`form-row${showErrors && errors.serialNumber ? ' form-row--error' : ''}`}>
                  <label htmlFor="serialNumber">Serial Number</label>
                  <input
                    id="serialNumber"
                    name="serialNumber"
                    type="text"
                    value={formData.serialNumber}
                    onChange={handleChange}
                  />
                  {showErrors && errors.serialNumber && <span className="form-error">{errors.serialNumber}</span>}
                </div>
                <div className={`form-row${showErrors && errors.purchaseDate ? ' form-row--error' : ''}`}>
                  <label htmlFor="purchaseDate">Purchase Date</label>
                  <input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                  {showErrors && errors.purchaseDate && <span className="form-error">{errors.purchaseDate}</span>}
                </div>
                <div className={`form-row${showErrors && errors.installationDate ? ' form-row--error' : ''}`}>
                  <label htmlFor="installationDate">Installation Date</label>
                  <input
                    id="installationDate"
                    name="installationDate"
                    type="date"
                    value={formData.installationDate}
                    onChange={handleChange}
                  />
                  {showErrors && errors.installationDate && <span className="form-error">{errors.installationDate}</span>}
                </div>
                <div className={`form-row full${showErrors && errors.notes ? ' form-row--error' : ''}`}>
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Anything we should know about this installation…"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                  {showErrors && errors.notes && <span className="form-error">{errors.notes}</span>}
                </div>
              </div>
              {errors.form && <div className="form-error" style={{ marginBottom: '0.5rem' }}>{errors.form}</div>}
              <button type="submit" className="btn btn-primary form-submit" disabled={isLoading}>
                {isLoading ? 'Submitting…' : 'Submit Registration'} <span className="btn-arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </section>
      </ScrollReveal>

    </div>
  );
};

export default Services;
