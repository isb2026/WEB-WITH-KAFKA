import { MovePaperMaster } from "@primes/types/purchase/incomingMaster";
import { BarcodeGenerator } from '@repo/react-barcode';
import { QRCodeGenerator } from '@repo/qrcode.react';
interface PrintableMovePaperProps {
    movePaper: MovePaperMaster;
    companyName?: string;
    productInfo?: {
        partNo?: string;
        spec?: string;
        material?: string;
        coating?: string;
        autoLine?: string;
        processing?: string;
    };
}

export const IncomingOrdersMovePaper = ({
    movePaper,
    companyName = "Company Name",
    productInfo
}: PrintableMovePaperProps) => {

    // Sample data - replace with actual props
    const workOrderNo = "WO-2024-001";
    const lotNo = "LOT-2024-001";
    const boxNo = "BOX-2024-001";
    const quantity = 2131;
    const weight = 133.80;
    const issueTime = new Date().toLocaleString();
    const status = "In Progress";
    
    // Sample data for the new table format
    const material = productInfo?.material || "Copper";
    const supplier = "PF02";
    const specification1 = productInfo?.spec || "Grade F";
    const specification2 = "Black";
    const amount = 1000;
    const amountUnit = "m";
    const weightAmount = 133.80;
    const weightUnit = "kg";

    const qrData = JSON.stringify({
        workOrderNo: workOrderNo,
        lotNo: lotNo,
        boxNo: boxNo,
        quantity: amount,
        weight: weight,
        issueTime: issueTime,
        status: status
    });

    return (
        <div className="bg-white p-6 max-w-4xl mx-auto print:p-4 print:max-w-none" id="incoming-move-paper">
            {/* Header Row - Outside the main table */}
            <div className="mb-4">
                <div className="grid grid-cols-12 gap-0">
                    {/* LOGO - 4 columns */}
                    <div className="col-span-4 bg-gray-100 p-4 text-center">
                        <div className="text-lg font-bold">{companyName}</div>
                        <div className="text-sm text-gray-600">LOGO</div>
                    </div>
                    
                    {/* Barcode - 6 columns */}
                    <div className="col-span-6 p-4 text-center">
                        <div className="flex justify-center">
                            <BarcodeGenerator 
                                value={movePaper.workOrderNo} 
                                height={40}
                                width={2}
                                fontSize={10}
                            />
                        </div>
                        <div className="text-sm font-bold mt-2">LOT: {movePaper.workOrderNo}</div>
                    </div>
                    
                    {/* Date Received - 2 columns */}
                    <div className="col-span-2 p-4 text-center">
                        <div className="text-sm font-bold">Date Received</div>
                        <div className="text-lg">{movePaper.dateRecieved?.toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="border-2 border-black">
                <table className="w-full border-collapse">
                    {/* Row 1: Material | Supplier */}
                    <tr>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Material: {movePaper.material}</div>
                        </td>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Supplier: {movePaper.vendorName}</div>
                        </td>
                    </tr>

                    {/* Row 2: Specification | Amount */}
                    <tr>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Specification: {specification1}</div>
                        </td>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Amount: {movePaper.quantity} {movePaper.unit}</div>
                        </td>
                    </tr>

                    {/* Row 3: Specification2 | Weight */}
                    <tr>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Color: {specification2}</div>
                        </td>
                        <td className="border border-black p-6 w-1/2">
                            <div className="font-bold text-lg">Weight: {weightAmount} {weightUnit}</div>
                        </td>
                    </tr>
                </table>

                {/* QR Code Section */}
                <div className="p-4 text-center border-t border-black">
                    <div className="text-sm font-bold mb-2">Complete Move Paper Data</div>
                    <QRCodeGenerator 
                        value={qrData}
                        size={120}
                    />
                    <div className="text-xs mt-2 text-gray-600">
                        Generated: {new Date().toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Print Info */}
            <div className="text-xs text-gray-500 mt-4 print:hidden">
                <div>Box No: {boxNo} | Quantity: {quantity} | Weight: {weight}kg</div>
            </div>
        </div>
    );
}