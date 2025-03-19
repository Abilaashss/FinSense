# VidFin Assist - AI Branch Manager

VidFin Assist is a sophisticated AI-powered platform that provides a video-based loan application experience. It mimics a real bank branch manager interaction, allowing users to apply for loans through video conversations instead of filling out lengthy forms.

## Key Features

1. **Virtual AI Branch Manager**
   - Pre-recorded video assistant that mimics a real-life bank manager
   - Structured financial questions through video interface
   - Human-like guidance on loan applications

2. **Video-Based Customer Interaction**
   - Record video responses instead of filling out forms
   - Basic facial verification for applicant consistency
   - Natural conversation-based application process

3. **Simplified Document Submission & Processing**
   - Upload Aadhaar, PAN, and income proof via mobile camera or file upload
   - Automatic extraction of key details from documents
   - Smart document verification

4. **Loan Eligibility & Decisioning**
   - Rule-based system for loan eligibility evaluation
   - Instant feedback on applications: Approved, Rejected, or Need More Info
   - Clear explanations and next steps

5. **Multi-Language Support**
   - Support for multiple Indian languages
   - Localized experience for different regions

## Technology Stack

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: TailwindCSS
- **Video Processing**: react-webcam, MediaRecorder API
- **Face Detection**: face-api.js
- **Document OCR**: Tesseract.js
- **Animation**: Framer Motion
- **Internationalization**: i18next

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/vidfin-assist.git
   cd vidfin-assist
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage Flow

1. **Home Page**: Introduction to the AI Branch Manager concept and its benefits
2. **Onboarding**: Basic user information collection
3. **Loan Interview**: Video conversation with the AI Branch Manager
4. **Document Upload**: Document verification and data extraction
5. **Loan Decision**: Outcome of the loan application with next steps

## Additional Requirements

To fully implement this project, you will need:

1. **Pre-recorded Video Assets**:
   - AI Branch Manager introduction videos
   - Question-specific videos for different loan interview stages
   - Videos in multiple languages (for multi-language support)

2. **Backend Services**:
   - API for loan decisioning logic
   - Storage solution for video responses and documents
   - User authentication and session management

3. **Integration Points**:
   - Credit bureau integration for credit score checks
   - Bank account verification system
   - eSign integration for loan agreement signing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact support@vidfinassist.com

---

Built with ❤️ for Standard Chartered Hackathon
