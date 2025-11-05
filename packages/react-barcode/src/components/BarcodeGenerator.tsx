import Barcode, {BarcodeProps} from 'react-barcode';

export const BarcodeGenerator: React.FC<BarcodeProps> = (props) => {
    return (
        <Barcode {...props} />
    );
}