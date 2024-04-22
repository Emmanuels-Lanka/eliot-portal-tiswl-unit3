interface EmailTemplateProps {
    recipientName: string;
    machine: {
        machineType: string;
        brandName: string;
        machineId: string;
        serialNumber: string;
    };
    operatorName: string;
    alertType: string;
}

const EmailTemplate = ({
    recipientName,
    machine,
    operatorName,
    alertType
}: EmailTemplateProps) => {
    return (
        <div style={{ backgroundColor: '#f3f4f6', padding: '2rem 0' }}>
            <div
                style={{
                    margin: '0 auto',
                    maxWidth: '768px',
                    backgroundColor: '#fff',
                    borderRadius: '0.9rem',
                    border: '1px solid #2d3748',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        textAlign: 'center',
                        padding: '1rem',
                        backgroundColor: '#2d3748',
                        borderRadius: '0.75rem 0.75rem 0 0'
                    }}
                >
                    <div
                        style={{
                            borderRadius: '0.5rem 0.5rem 0 0',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <img
                            src="https://ik.imagekit.io/eliotglobal/eliot-logo.png?updatedAt=1713631556206"
                            alt="logo"
                            style={{
                                display: 'block',
                                margin: '0 auto',
                                height: 'auto',
                                width: '10rem'
                            }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div
                    style={{
                        padding: '3rem 1.5rem 2.5rem 1.5rem',
                        textAlign: 'center',
                    }}
                >
                    <h1
                        style={{
                            marginBottom: '1.25rem',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#374151',
                        }}
                    >
                        Hello {recipientName} 👋,
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '1.5rem' }}>
                        We received a <span style={{ fontWeight: '600' }}>{alertType}</span> request from <span style={{ textDecoration: 'underline', fontWeight: '600' }}>{operatorName}</span> regarding the following machine.
                    </p>

                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginBottom: '1.5rem',
                            backgroundColor: '#edf2f7',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#2d3748',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                        fontSize: '14px'
                                    }}
                                >
                                    Detail
                                </th>
                                <th
                                    style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#2d3748',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>Machine Type</td>
                                <td style={{ padding: '0.75rem', color: '#4a5568', textTransform: 'uppercase' }}>{machine.machineType}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>Brand Name</td>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>{machine.brandName}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>Machine ID</td>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>{machine.machineId}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>Serial Number</td>
                                <td style={{ padding: '0.75rem', color: '#4a5568' }}>{machine.serialNumber}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#374151',
                            marginBottom: '1.25rem',
                        }}
                    >
                        Need Help?
                    </h2>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            marginTop: '-1rem',
                        }}
                    >
                        Please send any feedback or bug info to{' '}
                        <a
                            href="mailto:help@eliot.global"
                            style={{
                                color: '#2563eb',
                                textDecoration: 'underline',
                            }}
                        >
                            help@eliot.global
                        </a>
                    </p>
                </div>

                {/* Footer */}
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '1rem',
                        color: '#6b7280',
                        padding: '1.25rem',
                        backgroundColor: '#2d3748',
                        borderRadius: '0 0 0.75rem 0.75rem'
                    }}
                >
                    <a
                        href="https://emmanuelslanka.com/"
                        style={{
                            color: '#cbd5e0',
                            textDecoration: 'underline',
                            fontWeight: '500',
                        }}
                    >
                        Emmanuel&apos;s Lanka Pvt Ltd.
                    </a>
                    <p style={{ color: '#cbd5e0' }}>10 Wewala Rd, Ja-Ela, Sri Lanka.</p>
                </div>
            </div>
        </div>

    )
}

export default EmailTemplate