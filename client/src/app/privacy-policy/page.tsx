import PolicyLayout from "../../components/privacy-layout";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="October 24, 2025" type="privacy">
      <p>
        At <strong>Biluibaba</strong>, accessible from biluibaba.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Biluibaba and how we use it.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        Biluibaba collects data from customers, veterinarians, and vendors to provide our services effectively. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
      </p>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, phone number, and password.</li>
        <li><strong>Pet Information:</strong> Name, breed, age, and medical history (for Vet services).</li>
        <li><strong>Transaction Data:</strong> Payment details and purchase history.</li>
        <li><strong>Usage Data:</strong> How you interact with our website and services.</li>
        <li><strong>Vendor/Vet Information:</strong> Business details, licenses, and credentials (for service providers).</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>
        We use the information we collect in various ways, including to:
      </p>
      <ul>
        <li>Provide, operate, and maintain our website and services.</li>
        <li>Process orders and facilitate transactions.</li>
        <li>Provide user support and respond to inquiries.</li>
        <li>Improve, personalize, and expand our website.</li>
        <li>Understand and analyze how you use our website.</li>
        <li>Communicate with you, including for customer service and updates.</li>
      </ul>

      <h3>3. Data Sharing and Third Parties</h3>
      <p>
        Your data will only be used for service delivery and will not be shared with third parties except for necessary providers such as payment processors. We do not sell, trade, or rent your personal information to others.
      </p>

      <h3>4. Data Security</h3>
      <p>
        Biluibaba maintains security protocols to protect all user data. We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
      </p>

      <h3>5. Log Files & Cookies</h3>
      <p>
        Biluibaba follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
      </p>

      <h3>6. Third Party Privacy Policies</h3>
      <p>
        Biluibaba's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
      </p>

      <h3>7. Contact Us</h3>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info@biluibaba.com">info@biluibaba.com</a>.
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;