import AddSewingOperatorForm from "@/components/dashboard/forms/add-sewing-operator-form";
import { FileSpreadsheet } from "lucide-react";
import BulkUploadSewingOperatorData from "../_components/bulk-upload-data";

const CreateNewSewingOperator = () => {
  return (
    <>
      <AddSewingOperatorForm mode="create" />

      {/* Feeding the data to database from Excel */}
      <div className="mt-12 lg:mt-20 mx-auto max-w-7xl w-full max-lg:p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upload Bulk Sewing Operator Data
            </h2>
          </div>
          <p className="text-gray-600">
            Upload your Excel file to import operator data into the database.
            Make sure your file contains the required columns.
          </p>
        </div>
        <BulkUploadSewingOperatorData />
      </div>
    </>
  );
};

export default CreateNewSewingOperator;
