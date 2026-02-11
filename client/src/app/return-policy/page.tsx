import PolicyLayout from "../../components/privacy-layout";

const ReturnPolicy = () => {
  return (
    <PolicyLayout title="Return Policy" lastUpdated="October 24, 2025" type="return">
      <p>
        We offer a <strong>7-day return policy</strong> for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
      </p>

      <h3>1. Non-Returnable Items</h3>
      <p>
        Several types of goods are exempt from being returned for hygiene and safety reasons:
      </p>
      <ul>
        <li>Perishable goods such as frozen food or fresh treats.</li>
        <li>Opened dry/wet food containers (unless spoiled/expired).</li>
        <li>Sanitary products (diapers, litter box liners).</li>
        <li>Gift cards.</li>
        <li>Downloadable software products.</li>
      </ul>

      <h3>2. Damaged or Defective Items</h3>
      <p>
        If you received a defective or damaged item, please contact us immediately at <a href="mailto:support@biluibaba.com">support@biluibaba.com</a> with details and photos of the product and the defect. We will fully cover the return shipping cost for damaged items.
      </p>

      <h3>3. How to Initiate a Return</h3>
      <ol>
        <li>Log in to your account and go to "Order History".</li>
        <li>Select the order and click "Request Return".</li>
        <li>Fill out the form with the reason for the return and upload photos if necessary.</li>
        <li>Wait for our approval email with the return shipping address.</li>
      </ol>

      <h3>4. Return Shipping</h3>
      <p>
        You will be responsible for paying for your own shipping costs for returning your item unless the item was damaged or incorrect. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping (if handled by us) will be deducted from your refund.
      </p>

      <h3>5. Exchanges</h3>
      <p>
        We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a href="mailto:support@biluibaba.com">support@biluibaba.com</a>.
      </p>
    </PolicyLayout>
  );
};

export default ReturnPolicy;