import React, { useState } from 'react';
import './Help.css';

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'मैं वेबसाइट पर लॉगिन कैसे करूं?',
      answer: 'होमपेज पर "लॉगिन" बटन पर क्लिक करें। अपना मोबाइल नंबर और पासवर्ड डालें। यदि आपका अकाउंट नहीं है तो पहले रजिस्ट्रेशन करें।'
    },
    {
      question: 'क्या इस वेबसाइट का उपयोग फ्री है?',
      answer: 'हां, कृषि कनेक्ट की सभी बुनियादी सेवाएं बिल्कुल मुफ्त हैं। आप बिना किसी शुल्क के सभी सुविधाओं का लाभ उठा सकते हैं।'
    },
    {
      question: 'सरकारी योजनाओं की जानकारी कैसे देखूं?',
      answer: 'मेनू में "सरकारी योजना" सेक्शन पर जाएं। वहां आपको केंद्र और राज्य सरकार की सभी कृषि योजनाओं की विस्तृत जानकारी मिलेगी।'
    },
    {
      question: 'मैं अपनी प्रोफाइल कैसे अपडेट करूं?',
      answer: 'लॉगिन करने के बाद, ऊपरी दाएं कोने में अपनी प्रोफाइल फोटो पर क्लिक करें, फिर "प्रोफाइल एडिट करें" का विकल्प चुनें।'
    },
    {
      question: 'मौसम की जानकारी कहां मिलेगी?',
      answer: 'मुख्य मेनू में "मौसम" सेक्शन में आपको अपने क्षेत्र का वर्तमान मौसम और 7 दिन का पूर्वानुमान मिलेगा।'
    },
    {
      question: 'पासवर्ड भूल जाने पर क्या करें?',
      answer: 'लॉगिन पेज पर "पासवर्ड भूल गए?" लिंक पर क्लिक करें। अपना मोबाइल नंबर डालें और SMS से नया पासवर्ड सेट करें।'
    }
  ];

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>🌾 सहायता केंद्र</h1>
        <p>आपके सवालों के जवाब यहां मिलेंगे</p>
      </div>

      <div className="help-content">
        {/* FAQ Section */}
        <div className="faq-section">
          <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${expandedFaq === index ? 'active' : ''}`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  aria-expanded={expandedFaq === index}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon" aria-hidden>{expandedFaq === index ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${expandedFaq === index ? 'expanded' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <h2>संपर्क जानकारी</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon" aria-hidden>📞</div>
              <h3>हेल्पलाइन नंबर</h3>
              <p className="contact-detail">1800-123-4567</p>
              <p className="contact-info">सुबह 9 बजे से शाम 6 बजे तक</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon" aria-hidden>📧</div>
              <h3>ईमेल सपोर्ट</h3>
              <p className="contact-detail">help@krishiconnect.com</p>
              <p className="contact-info">24 घंटे में जवाब</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon" aria-hidden>💬</div>
              <h3>WhatsApp</h3>
              <p className="contact-detail">+91-98765-43210</p>
              <p className="contact-info">त्वरित सहायता के लिए</p>
            </div>

            <div className="contact-card government-card">
              <div className="govt-thumbnail">
                <div className="farmer-icon" aria-hidden>👨‍🌾</div>
                <div className="govt-logo" aria-hidden>🏛️</div>
              </div>
              <h3>कृषि एवं किसान कल्याण मंत्रालय</h3>
              <p className="contact-info">सरकारी योजनाएं और नीतियां</p>
              <a 
                href="https://www.agriwelfare.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="gov-link-btn"
              >
                वेबसाइट पर जाएं →
              </a>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="additional-help">
          <p>अभी भी कोई समस्या है? हमसे संपर्क करने में संकोच न करें।</p>
          <p>हमारी टीम आपकी सहायता के लिए हमेशा तैयार है।</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
