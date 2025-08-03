import React from 'react';

const DMCAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">DMCA - Disclaimer</h1>
          <p className="text-gray-300 text-lg">
            ProjectZ respects intellectual property rights and complies with DMCA regulations
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <div className="space-y-6 text-gray-300">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed">
                ProjectZ is committed to respecting the intellectual property rights of others and complying with the Digital Millennium Copyright Act (DMCA). We take copyright infringement seriously and will respond to notices of alleged copyright infringement that comply with the DMCA and any other applicable laws.
              </p>
            </section>

            {/* Response Time */}
            <section>
              <p className="text-lg leading-relaxed">
                If you believe that any content on our website is infringing upon your copyrights, please send us an email. Please allow up to 2-5 business days for a response. Please note that emailing your complaint to other parties such as our Internet Service Provider, Hosting Provider, and other third parties will not expedite your request and may result in a delayed response due to the complaint not being filed properly.
              </p>
            </section>

            {/* Required Information */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                Required Information for DMCA Complaints
              </h2>
              <p className="text-lg mb-4">
                In order for us to process your complaint, please provide the following information:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 text-lg">
                <li>A description of the copyrighted work that you claim is being infringed;</li>
                <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled with a URL and proof you are the original owner or other location of that material;</li>
                <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
                <li>The following statement: "I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)";</li>
                <li>The following statement: "The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed";</li>
                <li>The following statement: "I understand that I am subject to legal action upon submitting a DMCA request without solid proof.";</li>
                <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.</li>
              </ul>
            </section>

            {/* Important Notice */}
            <section className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-3">IMPORTANT NOTICE</h3>
              <div className="space-y-3 text-lg">
                <p>
                  <strong>None of the files listed on ProjectZ are hosted on our servers.</strong> All links point to content hosted on third-party websites.
                </p>
                <p>
                  <strong>ProjectZ does not accept responsibility</strong> for content hosted on third-party websites and has no involvement in the downloading/uploading of movies.
                </p>
                <p>
                  <strong>We only post links</strong> that are available on the internet.
                </p>
                <p>
                  If you believe that any content on our website infringes upon your intellectual property rights and you hold the copyright for that content, please report it to{' '}
                  <a href="mailto:contact@projectz.live" className="text-blue-400 hover:text-blue-300 underline">
                    contact@projectz.live
                  </a>{' '}
                  and the content will be immediately removed.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-blue-900 border border-blue-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-lg">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contact@projectz.live" className="text-blue-400 hover:text-blue-300 underline">
                    contact@projectz.live
                  </a>
                </p>
                <p className="text-lg">
                  <strong>Response Time:</strong> 2-5 business days
                </p>
                <p className="text-lg">
                  <strong>Platform:</strong> ProjectZ - Content Indexing Service
                </p>
              </div>
            </section>

            {/* Legal Disclaimer */}
            <section className="bg-gray-700 border border-gray-600 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-300 mb-3">Legal Disclaimer</h3>
              <p className="text-lg leading-relaxed">
                This DMCA policy is provided for informational purposes only and does not constitute legal advice. 
                For legal matters, please consult with a qualified attorney. ProjectZ reserves the right to modify 
                this policy at any time without prior notice.
              </p>
            </section>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default DMCAPage; 