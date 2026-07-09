import { LegalPage } from './legal/LegalPage';

const termsHtml = `
<p><strong>Last updated:</strong> January 1, 2026</p>
<h2>Acceptance</h2>
<p>By using this website, you agree to these Terms of Service.</p>
<h2>Operator</h2>
<p>
  This website is operated by the site owner and may use third-party infrastructure and analytics processors to
  provide the service.
</p>
<h2>Permitted Use</h2>
<p>You agree not to misuse the site, interfere with its operation, or attempt unauthorized access.</p>
<h2>Analytics and Privacy</h2>
<p>
  Use of this website may involve collection of usage and technical analytics data as described in the Privacy Policy.
  Where required, analytics is subject to user consent choices.
</p>
<h2>Intellectual Property</h2>
<p>
  Unless otherwise stated, site content and branding are protected by applicable intellectual property laws and may
  not be reused without permission.
</p>
<h2>Changes</h2>
<p>We may update these terms from time to time. Updated terms are effective when posted on this page.</p>
<h2>Disclaimer</h2>
<p>The website is provided on an "as is" and "as available" basis to the extent permitted by law.</p>
<h2>Limitation of Liability</h2>
<p>
  To the maximum extent permitted by law, the site operator is not liable for indirect, incidental, special,
  consequential, or punitive damages arising from use of the website.
</p>
<h2>Governing Law</h2>
<p>
  These terms are governed by applicable law in the operator's jurisdiction, unless mandatory local consumer law
  provides otherwise.
</p>
<h2>Contact</h2>
<p>
  Legal requests can be sent to <a href="mailto:privacy@fimo.ai">privacy@fimo.ai</a>.
</p>
`;

const Terms = () => {
  return <LegalPage title="Terms of Service" lastUpdated="January 1, 2026" html={termsHtml} />;
};

export default Terms;
