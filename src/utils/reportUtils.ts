import { ReportForm, ReportType } from '../types';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_z5rfp68',
  templateId: 'template_xmq3l8p',
  apiKey: 'y7_NNi0mZ5SMrJBzk'
};

// Load EmailJS dynamically
let emailjs: any = null;

const loadEmailJS = async () => {
  if (typeof window !== 'undefined' && !emailjs) {
    const { default: EmailJS } = await import('@emailjs/browser');
    emailjs = EmailJS;
    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.apiKey);
  }
  return emailjs;
};

export const sendReportEmail = async (reportData: ReportForm): Promise<boolean> => {
  // Store report in localStorage for tracking first
  storeReport(reportData);
  
  try {
    const emailjs = await loadEmailJS();
    if (!emailjs) {
      console.warn('EmailJS not available, report stored locally only');
      return true; // Still return true since report is stored
    }

    const templateParams = {
      name: reportData.userName,
      email: reportData.userEmail,
      url: `${window.location.origin}/movie/${reportData.movieId}`,
      message: `Movie: ${reportData.movieTitle}\nType: ${getReportTypeLabel(reportData.reportType)}\nDetails: ${reportData.additionalDetails || 'No additional details provided'}`,
      date: new Date(reportData.timestamp).toLocaleString()
    };

    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.apiKey
    );
    
    return true;
  } catch (error) {
    console.error('Error sending report email:', error);
    console.log('Report stored locally despite email failure');
    return true; // Return true since report is stored locally
  }
};

export const getReportTypeLabel = (type: ReportType): string => {
  const labels: Record<ReportType, string> = {
    broken_link: 'Broken Link',
    download_issue: 'Download Issue',
    video_quality: 'Video Quality Issue',
    subtitle_issue: 'Subtitle Issue',
    request_anime: 'Anime Request',
    other: 'Other Issue'
  };
  return labels[type];
};

export const getReportTypeDescription = (type: ReportType): string => {
  const descriptions: Record<ReportType, string> = {
    broken_link: 'Video or download link is not working',
    download_issue: 'Problems with downloading the content',
    video_quality: 'Poor video quality or playback issues',
    subtitle_issue: 'Missing or incorrect subtitles',
    request_anime: 'Request for a new anime to be added',
    other: 'Any other issues or concerns'
  };
  return descriptions[type];
};

const storeReport = (reportData: ReportForm) => {
  try {
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    const reportWithId = {
      ...reportData,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending' as const
    };
    reports.push(reportWithId);
    localStorage.setItem('userReports', JSON.stringify(reports));
  } catch (error) {
    console.error('Error storing report:', error);
  }
};

export const getUserReports = () => {
  try {
    return JSON.parse(localStorage.getItem('userReports') || '[]');
  } catch (error) {
    console.error('Error getting user reports:', error);
    return [];
  }
};

export const validateReportForm = (formData: Partial<ReportForm>): string[] => {
  const errors: string[] = [];
  
  if (!formData.movieTitle?.trim()) {
    errors.push('Movie title is required');
  }
  
  if (!formData.userName?.trim()) {
    errors.push('Your name is required');
  }
  
  if (!formData.userEmail?.trim()) {
    errors.push('Your email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
}; 