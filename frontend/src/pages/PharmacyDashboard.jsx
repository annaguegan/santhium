// Tableau de bord du pharmacien
import { useState, useEffect } from 'react';
import { CodeGenerator } from '../components/pharmacy/CodeGenerator';
import { DocumentList } from '../components/pharmacy/DocumentList';
import { documentService } from '../services/documentService';

const PharmacyDashboard = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await documentService.getAll();
    setDocuments(docs);
  };

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <CodeGenerator />
      <DocumentList documents={documents} onRefresh={loadDocuments} />
    </div>
  );
};