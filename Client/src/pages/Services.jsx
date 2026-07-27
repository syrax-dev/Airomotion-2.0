import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Services.css';
import { submitRegistration } from '../api/api';

const sanitizeClientText = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const MAX_INVOICE_PDF_SIZE = 5 * 1024 * 1024;
const MAX_INVOICE_PDF_SIZE_LABEL = '5 MB';

const serviceFaqs = [
  {
    question: 'What products can I register for warranty coverage?',
    answer: 'You can register eligible AIROMOTION smart automation, security, and energy-management products purchased through us or an authorised partner.'
  },
  {
    question: 'Why do I need to upload my invoice?',
    answer: 'Your invoice confirms the purchase date, product details, and warranty eligibility. Please upload a PDF invoice that is 5 MB or smaller.'
  },
  {
    question: 'How long is the warranty on AIROMOTION products?',
    answer: 'Warranty duration depends on the product category and the terms supplied with your purchase. Once registered, our team can confirm the applicable coverage for your product.'
  },
  {
    question: 'Can I register more than one product?',
    answer: 'Yes. Submit one registration for each product so that every serial number, installation detail, and invoice is recorded accurately.'
  },
  {
    question: 'What if I cannot find my serial number?',
    answer: 'Check the product label, packaging, or purchase invoice. If you still cannot find it, contact our support team with your purchase details and product model.'
  },
  {
    question: 'Do you provide installation for smart home systems?',
    answer: 'Yes. Our trained team provides site assessment, wiring and infrastructure support, device installation, configuration, testing, and final handover.'
  },
  {
    question: 'Can AIROMOTION integrate products from other brands?',
    answer: 'We assess compatibility during consultation and can recommend an integrated automation, security, or energy solution that works reliably with your existing setup.'
  },
  {
    question: 'How do I request product service or technical support?',
    answer: 'Use our Contact page to share the product model, serial number, and issue. Our team will review the request and guide you on the next steps.'
  }
];

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
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const registrationSectionRef = useRef(null);

  useEffect(() => {
    if (!submitSuccess || !registrationSectionRef.current) return;

    requestAnimationFrame(() => {
      registrationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [submitSuccess]);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const resetForm = () => {
    setFormData({
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
    setInvoiceFile(null);
    setErrors({});
    setShowErrors(false);
    setSubmitSuccess(false);
  };

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

  const validateField = (name, value, values = formData) => {
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
      case 'purchaseDate': {
        if (!value) return 'Purchase date is required.';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate <= today ? '' : 'Purchase date cannot be in the future.';
      }
      case 'installationDate': {
        if (!value) return 'Installation date is required.';
        const selectedDate = new Date(`${value}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) return 'Installation date cannot be in the future.';
        if (values.purchaseDate && value < values.purchaseDate) {
          return 'Installation date cannot be before the purchase date.';
        }
        return '';
      }
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

    if (!invoiceFile) {
      validationErrors.invoiceFile = 'Invoice PDF is required.';
    } else if (invoiceFile.type !== 'application/pdf') {
      validationErrors.invoiceFile = 'Only PDF files are allowed.';
    } else if (invoiceFile.size > MAX_INVOICE_PDF_SIZE) {
      validationErrors.invoiceFile = `Invoice PDF must be ${MAX_INVOICE_PDF_SIZE_LABEL} or smaller.`;
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };

    setFormData(nextFormData);

    if (showErrors) {
      setErrors((prev) => {
        const nextErrors = {
          ...prev,
          [name]: validateField(name, value, nextFormData)
        };

        // Changing either date can change the validity of the other date.
        if (name === 'purchaseDate' || name === 'installationDate') {
          nextErrors.installationDate = validateField(
            'installationDate',
            nextFormData.installationDate,
            nextFormData
          );
        }

        return nextErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setInvoiceFile(file);

    let fileError = '';
    if (!file) {
      fileError = 'Invoice PDF is required.';
    } else if (file.type !== 'application/pdf') {
      fileError = 'Only PDF files are allowed.';
    } else if (file.size > MAX_INVOICE_PDF_SIZE) {
      fileError = `Invoice PDF must be ${MAX_INVOICE_PDF_SIZE_LABEL} or smaller.`;
    }
    setErrors((prev) => ({ ...prev, invoiceFile: fileError }));
  };

  const handleFileReset = () => {
    setInvoiceFile(null);
    setErrors((prev) => ({ ...prev, invoiceFile: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const honeypot = e.currentTarget.elements.website?.value || '';

    setShowErrors(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length !== 0) return;

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', sanitizeClientText(formData.fullName));
      payload.append('phone', sanitizeClientText(formData.phone));
      payload.append('email', sanitizeClientText(formData.email).toLowerCase());
      payload.append('address', sanitizeClientText(formData.address));
      payload.append('productCategory', sanitizeClientText(formData.productCategory));
      payload.append('productName', sanitizeClientText(formData.productName));
      payload.append('modelNumber', sanitizeClientText(formData.modelNumber));
      payload.append('serialNumber', sanitizeClientText(formData.serialNumber));
      payload.append('purchaseDate', sanitizeClientText(formData.purchaseDate));
      payload.append('installationDate', sanitizeClientText(formData.installationDate));
      payload.append('notes', sanitizeClientText(formData.notes));
      payload.append('website', honeypot);
      payload.append('invoicePdf', invoiceFile);

      await submitRegistration(payload);
      setSubmitSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit registration. Please try again.';
      setErrors((prev) => ({ ...prev, form: msg }));
    } finally {
      setIsLoading(false);
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
        <section
          className={`section section-dark ${submitSuccess ? 'registration-section--success' : ''}`}
          ref={registrationSectionRef}
        >
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
              <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ marginTop: '1rem' }}>
                Register another product
              </button>
            </div>
          ) : (
            <form className="form-card reveal" noValidate onSubmit={handleSubmit}>
              <input
                className="honeypot-field"
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="form-grid">
                <div className={`form-row${showErrors && errors.fullName ? ' form-row--error' : ''}`}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Name"
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
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="xxxxx xxxxx"
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
                    placeholder="name@example.com"
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
                    placeholder="Your Address"
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
                    placeholder="e.g. Smart Switch"
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
                    placeholder="e.g. MX-200"
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
                    placeholder="e.g. SN123456"
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
                    min={formData.purchaseDate || undefined}
                  />
                  {showErrors && errors.installationDate && <span className="form-error">{errors.installationDate}</span>}
                </div>
                <div className={`form-row full${(showErrors || errors.invoiceFile) && errors.invoiceFile ? ' form-row--error' : ''}`}>
                  <label htmlFor="invoicePdf">Invoice PDF</label>
                  <div className="form-file-row">
                    <div className="form-file-name-wrap">
                      {invoiceFile ? (
                        <span className="form-file-name">{invoiceFile.name}</span>
                      ) : (
                        <span className="form-file-placeholder">No file selected</span>
                      )}
                    </div>
                    <div className="form-file-actions">
                      {invoiceFile && (
                        <button
                          type="button"
                          className="form-file-clear"
                          onClick={handleFileReset}
                          aria-label="Remove selected invoice PDF"
                        >
                          ×
                        </button>
                      )}
                      <div className="form-file-control">
                        <input
                          key={invoiceFile ? invoiceFile.name : 'invoice-file'}
                          id="invoicePdf"
                          name="invoicePdf"
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="form-file-input"
                        />
                        <span className="form-file-label">Choose file</span>
                      </div>
                    </div>
                  </div>
                  {(showErrors || errors.invoiceFile) && errors.invoiceFile && <span className="form-error">{errors.invoiceFile}</span>}
                </div>
                <div className={`form-row full${showErrors && errors.notes ? ' form-row--error' : ''}`}>
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Tell us about the installation or any additional details…"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                  {showErrors && errors.notes && <span className="form-error">{errors.notes}</span>}
                </div>
              </div>
              {errors.form && <div className="form-error" style={{ marginBottom: '0.5rem' }}>{errors.form}</div>}
              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary form-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true"></span>
                      Submitting…
                    </>
                  ) : (
                    <>Submit Registration <span className="btn-arrow-inline">→</span></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      </ScrollReveal>

      <section className="service-faq-section" aria-labelledby="service-faq-title">
        <div className="container service-faq-container">
          <div className="service-faq-intro">
            <span className="service-faq-eyebrow">Support, clarified</span>
            <h2 id="service-faq-title">Frequently asked <em>questions.</em></h2>
            <p>Everything you need to know about product registration, installation, and ongoing support.</p>
          </div>
          <div className="service-faq-list">
            {serviceFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div className={`service-faq-item${isOpen ? ' is-open' : ''}`} key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      className="service-faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`service-faq-answer-${index}`}
                    >
                      <span className="service-faq-number">{String(index + 1).padStart(2, '0')}</span>
                      <span>{faq.question}</span>
                      <span className="service-faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                  </h3>
                  <div
                    id={`service-faq-answer-${index}`}
                    className="service-faq-answer"
                    aria-hidden={!isOpen}
                  >
                    <div className="service-faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
