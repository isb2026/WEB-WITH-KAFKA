
import { QRCodeSVG, QRCodeSVGProps } from "qrcode.react";

export const QRCodeGenerator: React.FC<QRCodeSVGProps> = (props) => {

    return (
        <QRCodeSVG
            {...props}
        />
    )

}