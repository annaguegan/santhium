// Génère un code/QR code pour une pharmacie
import { useState } from 'react';
import { codeService } from '../../services/codeService';
import QRCode from 'qrcode.react';

export const CodeGenerator = () => {
  const [code, setCode] = useState(null);
  const [qrData, setQrData] = useState(null);

  const generateCode = async () => {
    const result = await codeService.generate();
    setCode(result.code);
    setQrData(result.url);
  };

  return (
    <div>
      <button onClick={generateCode}>Générer un code</button>
      {qrData && <QRCode value={qrData} />}
      {code && <p>Code: {code}</p>}
    </div>
  );
};