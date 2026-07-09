import { LegalPage } from './legal/LegalPage';

const privacyHtml = `
<p><strong>Last updated:</strong> January 1, 2026</p>
<h2>Overview</h2>
<p>
  This Privacy Policy explains how this website collects, uses, and discloses information when you use this website.
</p>
<h2>Data We Collect</h2>
<p>We may collect:</p>
<ul>
  <li>Usage information (such as visited pages, timestamps, and navigation flow).</li>
  <li>Technical information (such as browser type, operating system, device type, and approximate region derived from IP metadata).</li>
  <li>Referral information (such as referrer URL).</li>
  <li>Identifiers used for analytics (such as visitor and session identifiers stored in browser storage).</li>
</ul>
<h2>How We Use Data</h2>
<p>
  We use data to operate this website, measure traffic and performance, detect abuse, troubleshoot errors, and improve
  content and product decisions.
</p>
<h2>Legal Basis</h2>
<p>Depending on your location, processing may rely on:</p>
<ul>
  <li>Your consent (for example, where analytics consent is required).</li>
  <li>Legitimate interests (for example, service reliability, security, and product improvement).</li>
  <li>Compliance with legal obligations when applicable.</li>
</ul>
<h2>Cookies and Similar Technologies</h2>
<p>
  This website may use cookies or browser storage for session continuity and analytics measurement. Where required by
  law, non-essential analytics technologies are used only after consent.
</p>
<h2>Sharing and Processors</h2>
<p>
  We may use service providers to process analytics and infrastructure data on our behalf. For this website, analytics
  events may be processed by Fimo infrastructure providers as a data processor for the site operator.
</p>
<h2>International Transfers</h2>
<p>
  Data may be processed in countries other than your own. When required, we apply appropriate safeguards for
  cross-border transfers.
</p>
<h2>Retention</h2>
<p>
  We retain analytics data only for as long as reasonably necessary for operational, reporting, security, and
  compliance needs, then delete or de-identify it.
</p>
<h2>Your Rights</h2>
<p>
  Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, object to certain
  processing, or receive a copy of your personal data.
</p>
<h2>Children's Privacy</h2>
<p>
  This website is not intended for children under the age required by applicable law, and we do not knowingly collect
  personal data from children where prohibited.
</p>
<h2>Security</h2>
<p>
  We apply reasonable technical and organizational safeguards to protect data, but no method of transmission or
  storage is completely secure.
</p>
<h2>Policy Changes</h2>
<p>
  We may update this policy from time to time. Material changes will be reflected by updating the "Last updated" date
  on this page.
</p>
<h2>Contact</h2>
<p>
  Privacy requests can be sent to <a href="mailto:privacy@fimo.ai">privacy@fimo.ai</a>.
</p>
`;

const Privacy = () => {
  return <LegalPage title="Privacy Policy" lastUpdated="January 1, 2026" html={privacyHtml} />;
};

export default Privacy;
