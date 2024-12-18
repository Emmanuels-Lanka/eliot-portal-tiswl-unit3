import { PDFViewer } from '@react-pdf/renderer';

import RoamingQcReportTemplate from './roaming-qc-report-template';

interface RoamingQcReportViewerProps {
    details: { label: string, value: string }[];
    data: any[];
}

const RoamingQcReportViewer = ({ details, data }: RoamingQcReportViewerProps) => {
    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer width="100%" height="100%">
                <RoamingQcReportTemplate
                    details={details}
                    data={data}
                />
            </PDFViewer>
        </div>
    );
}

export default RoamingQcReportViewer;
