import PolicyLayout from "../../components/privacy-layout";

const RefundPolicy = () => {
  return (
    <PolicyLayout title="Refund Policy" lastUpdated="October 24, 2025" type="refund">
      <p>
        At Biluibaba, we want you and your pet to be completely happy! If you are not satisfied with your purchase, we are here to help. This Refund Policy outlines when and how refunds are processed.
      </p>

      <h3>1. Product Refunds</h3>
      <p>
        Refunds for physical products (food, accessories, toys) are issued under the following conditions:
      </p>
      <ul>
        <li>The item is out of stock after payment was made.</li>
        <li>The item received is damaged, expired, or incorrect.</li>
        <li>The return request is approved (see Return Policy).</li>
      </ul>
      <p>
        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
      </p>

      <h3>2. Veterinary Consultation Refunds</h3>
      <p>
        For online vet consultations:
      </p>
      <ul>
        <li><strong>Full Refund:</strong> If the vet does not join the scheduled session within 15 minutes.</li>
        <li><strong>Full Refund:</strong> If you cancel the appointment at least 24 hours in advance.</li>
        <li><strong>No Refund:</strong> If you miss the appointment or cancel less than 24 hours before the scheduled time.</li>
      </ul>

      <h3>3. Processing Time</h3>
      <p>
        If your refund is approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within <strong>7-10 business days</strong>.
      </p>

      <h3>4. Late or Missing Refunds</h3>
      <p>
        If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund yet, please contact us.
      </p>
    </PolicyLayout>
  );
};

export default RefundPolicy;