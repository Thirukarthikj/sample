export const submitEnquiry = async (enquiryData) => {
  try {
    const payload = {
      ...enquiryData,
      date: new Date().toISOString(),
      status: 'New'
    };

    const stored = JSON.parse(localStorage.getItem('rir_enquiries') || '[]');
    stored.unshift(payload);
    localStorage.setItem('rir_enquiries', JSON.stringify(stored));

    return { success: true, message: 'Enquiry received! Our concierge will contact you shortly.' };
  } catch (err) {
    console.error('Enquiry submission error:', err);
    return { success: false, message: 'Failed to submit enquiry. Please try again.' };
  }
};

export const subscribeNewsletter = async (email) => {
  try {
    const stored = JSON.parse(localStorage.getItem('rir_newsletter') || '[]');
    stored.unshift({ email, date: new Date().toISOString() });
    localStorage.setItem('rir_newsletter', JSON.stringify(stored));

    return { success: true, message: 'Subscribed successfully!' };
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return { success: false, message: 'Subscription failed. Please try again.' };
  }
};
