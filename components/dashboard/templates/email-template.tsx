import Image from "next/image"
import Link from "next/link"

interface EmailTemplateProps {
    name: string
}

const EmailTemplate = ({
    name
}: EmailTemplateProps) => {
    return (
        <div className="bg-gray-100 py-8">
            <div className="mx-auto max-w-3xl bg-white rounded-xl">
                {/* Header */}
                <div className="border-t-4 border-gray-900 rounded-xl">
                    <div className="py-5 text-center">
                        {/* Logo */}
                        <Image
                            src="/eliot-logo.png"
                            alt="logo"
                            className="mx-auto h-auto w-48 mt-3"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    <h1 className="mb-5 text-3xl font-bold text-gray-700">
                        Hello {name}, How are you!
                    </h1>
                    <p className="text-sm text-gray-600">
                        Yes, we know. An email to confirm an email. 🤪
                    </p>
                    <p className="mb-5 text-sm text-gray-600">
                        Please validate your email address in order to get started using `Product`.
                    </p>

                    {/* Confirm Button */}
                    <a href="#" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white">
                        Confirm Your Email
                    </a>

                    <p className="mt-5 mb-10 text-sm text-gray-600">
                        Or verify using this link:
                        <a href="https://www.htmlemailtemplates.net/free-html-emails-for-startups" className="text-blue-600">https://www.htmlemailtemplates.net/free-html-emails-for-startups</a>
                    </p>

                    <h2 className="mb-5 text-xl font-bold text-gray-700">
                        Need Help?
                    </h2>
                    <p className="text-sm text-gray-600">
                        Please send any feedback or bug info to <a href="mailto:info@example.com" className="text-blue-600">info@example.com</a>
                    </p>
                </div>

                {/* Footer */}
                <div className="mx-auto max-w-3xl py-5 text-center text-sm">
                    <Link href='https://emmanuelslanka.com/' className="text-gray-600 font-medium text-base underline underline-offset-2">
                        Emmanuel's Lanka Pvt Ltd.
                    </Link>
                    <p className="text-gray-500">
                        10 Wewala Rd, Ja-Ela, Sri Lanka.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailTemplate