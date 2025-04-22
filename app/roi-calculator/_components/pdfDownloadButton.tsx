import { ReactElement } from 'react';
import { PDFDownloadLink, DocumentProps } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';

export const PdfDownloadButton = ({
  document,
  fileName,
  loadingText = "Generating PDF...",
  readyText = "Download PDF Report",
  className = ""
}: {
  document: ReactElement<DocumentProps>; 
  fileName: string;
  loadingText?: string;
  readyText?: string;
  className?: string;
}) => {
  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className={className}
    >
        <Button className="mt-5">
          Download as PDF
        </Button>
              </PDFDownloadLink>
  );
};
